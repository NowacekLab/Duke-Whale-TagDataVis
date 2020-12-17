import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/Icons/Delete';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import UploadProgress from './UploadProgress';
import Confirmation from "./Confirmation";
import {useDispatch} from 'react-redux';
import Notification from "./Notification";

import useIsMountedRef from "../functions/useIsMountedRef";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import forceLoadActionsHandler from "../functions/forceLoad/forceLoadActionsHandler";

import * as child from 'child_process';

const useStyles = makeStyles({
  buttonCont: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },  
  loadingSmaller: {
    display: "none",
    zIndex: 99998,
    top: 0,
    left: 200, 
    right: 0,
    height: 5,
  },
});

type Row = Record<string, string>;
type FileActionsProps = {
  refreshTableView: Function, 
  selectedFile: string, 
  fileRows: Array<Row>,
}

const FileActions = (props: FileActionsProps) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();

  // **TO INTERACT WITH PYTHON**
  const path = require('path');
  const isDev = process.env.NODE_ENV !== 'production';
  const remote = require('electron').remote;
  const scripts_path = isDev ? path.resolve(path.join(__dirname, 'scripts')) : path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
  const main_script_path = path.resolve(path.join(scripts_path, 'main.py'));
  const spawn = require("child_process").spawn; 
  const python3 = path.resolve(path.join(scripts_path, 'env', 'bin','python3'))

  // Unrelated to above 
  const upload = React.useRef<HTMLInputElement>(null);
  const [chosenFile, setChosenFile] = useState<string>(""); // this is table file selectedFile
  const [uploadFile, setUploadFile] = useState<any>({}); // this is the file to be uploaded, type is more Record<string, string>

  const color = createMuiTheme({
    palette: {
        primary: {
            main: "#012069"
        }
    },
  });

  // CONFIRMATION
  const confirmations: Record<string, Record<string, string>> = {
    "delete": {
      "title": `Delete ${chosenFile}?`,
      "description": "This will permanently delete the file and its graphs."
    },
    "upload-exists": {
      "title": `Upload `,
      "description": `A file with the same name is already uploaded. Reuploading will
      take extra time to reprocess the file and will replace all of the existing file's information.`
    },
    "upload-new": {
      "title": `Upload `,
      "description": `Uploading may take a long time to process the file appropriately.`
    },
    "reprocess": {
      "title": `Reprocess ${chosenFile}?`,
      "description": "It may take a long time to process the file appropriately."
    }
  }
  const [confirmInfo, setConfirmInfo]: any = useState({}); // was running into bug with Symbol.Iterator with Record<>
  const [pendingAction, setPendingAction] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  }
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  }
  const verifyConfirm = () => {

    switch (pendingAction) {
      case "delete":
        handleAction('delete');
        break;
      case "upload":
        handleUpload('upload');
        setUploadFile({});
        break;
      case "reprocess":
        handleUpload('reprocess');
    }

    handleCloseConfirm();

    setPendingAction("");
  }
  const rejectConfirm = () => {
    if (pendingAction === 'upload') {
      setUploadFile({});
    }
    handleCloseConfirm();
    setPendingAction("");
  }
  const fileExists = (file1: string) => {

    if (file1 === "") return false;

    if (file1.endsWith('.mat')) {
      file1 = file1.replace('.mat', '.csv');
    }

    for (const obj of props.fileRows) {
      let file2 = obj['file'];
      if (file1 === file2) {
        return true;
      }
    }
    return false;
  }
  const handleConfirm = (action: string, uploadFileName?: string) => {

    setPendingAction(action);

    if (action === 'upload') {
      if (fileExists(uploadFileName ?? "")) {
        const obj = confirmations['upload-exists'];
        obj['title'] = obj['title'] + `${uploadFileName}?`;
        setConfirmInfo(obj);
      } else {
        const obj = confirmations['upload-new'];
        obj['title'] = obj['title'] + `${uploadFileName}?`;
        setConfirmInfo(obj);
      }
    } else {
      const obj = confirmations[action];
      setConfirmInfo(obj);
    }
    handleOpenConfirm();
  }

  // Executes whenever props.selectedFile changes (interact with table)
  useEffect(() => {

    if (isMountedRef.current) {
      setChosenFile(props.selectedFile);
    }
  }, [props.selectedFile, props.fileRows])

  const dispatch = useDispatch();
  const notifActionHandler = new notifsActionsHandler(dispatch);
  const forceLoadActionHandler = new forceLoadActionsHandler(dispatch);

  const showSuccessMsg = (msg: string) => {
    notifActionHandler.showSuccessNotif(msg);
  }
  const showErrorMsg = (msg: string) => {
    notifActionHandler.showErrorNotif(msg);
  }

  // Messages for actions 
  const messages: Record<string, Record<string, any>> = {
    'True': {
      'func': showSuccessMsg,
      'upload': 'Successfully uploaded and processed.',
      'regenerate': 'Successfully regenerated graphs.',
      'delete': `${chosenFile} deleted.`,
      'edit': `Successfully opened ${chosenFile}`,
      'save': 'Saved in data_visualization folder in Downloads!'
    },
    'False': {
      'func': showErrorMsg,
      'upload': 'Failed to upload and/or process.',
      'regenerate': 'Failed to regenerate graphs.',
      'delete': 'File could not be deleted.',
      'edit': 'File could not be opened.',
      'save': 'File could not be saved.'
    }
  }

  // Handles the message based on response and action taken 
  function handleResponse(response: string, action: string) {
    if (!(messages.hasOwnProperty(response))) {
      const notifMsg = "Error. Please contact developers.";
      showErrorMsg(notifMsg);
    } else {
      const notifMsg = messages[response][action];
      const notifFunc = messages[response]['func'];
      notifFunc(notifMsg);
    }
  } 

  // Handlers attached to buttons 
  function handleComment() {
    console.log('placeholder');
  }
  function handleReprocess() {
    handleConfirm('reprocess');
  }
  function handleEdit() {
    handleAction('edit');
  }
  function handleDelete() {
    handleConfirm('delete');
  }
  function handleSave() {
    handleAction('save');
  }
  function handleFileUpload() {
    upload && upload.current ? upload.current.click() : null;
  }

  // Actual executors...
  function handleAction(action: string) {

    forceLoadActionHandler.activateForceLoad();

    if (action === 'delete') {
      const current_file = localStorage.getItem('selectedGraphFile') || "";
      if (current_file === chosenFile) {
        localStorage.setItem('selectedGraphFile', "");
      }
    }

    const args = new Array('-u', main_script_path, 'actions', chosenFile, action);

    const pythonProcess = spawn(python3, args);

    const loaderSmaller: HTMLElement | null = document.getElementById('loader-smaller');
    loaderSmaller  && loaderSmaller.style ? loaderSmaller.style.display='flex' : null;

    pythonProcess.stdout.on('data', (data: any) => {
      let resp = data.toString().trim();

      if (action === 'save' && resp !== 'False') {
        // shell.showItemInFolder(resp); --> convert this to opening downloads folder in preferences.json when it is made!!!
        console.log('placeholder');
      }

      handleResponse(resp, action);

      loaderSmaller && loaderSmaller.style ? loaderSmaller.style.display = 'none' : null;

      forceLoadActionHandler.deactivateForceLoad();

    })
  }
  
  // The below is very ugly! 
  const [uploadingNotReprocessing, setUploadingNotReprocessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updateUploadStateIndicator, setUpdateUploadStateIndicator] = useState(0);
  const [finishedUploading, setFinishedUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({
    "processed": "progress", 
    "graphs2D": "progress",
    "graphs3D": "progress",
  });

  const resetUploadState = () => {
    forceLoadActionHandler.deactivateForceLoad();

    setUploadProgress({
      "processed": "progress", 
      "graphs2D": "progress",
      "graphs3D": "progress",
    })

    setUpdateUploadStateIndicator(0);

    setFinishedUploading(false);
    setUploading(false);
  }

  const handleProcess = (process: child.ChildProcess, action: string) => {

    process && process.stdout && process.stdout.on('data', (data) => {
      let resp = data.toString().trim();
      resp = resp.split(":");

      console.log(resp);

      switch (resp[0]) {// this will do for now ... not too inefficient because it's just small stream/stages 
        case "processed":
          if (resp[1].startsWith('success')) {
            uploadProgress[resp[0]] = 'success';
          } else {
            uploadProgress[resp[0]] = 'fail';
          }
          setUploadProgress(uploadProgress);
          setUpdateUploadStateIndicator(2); // im going to be honest here and say that I'm not sure why this hard-coded # increment works and a variable + 1 does not
          break;
        case "graphs2D":
          if (resp[1].startsWith('success')) {
            uploadProgress[resp[0]] = 'success';
          } else {
            uploadProgress[resp[0]] = 'fail';
          }
          setUploadProgress(uploadProgress);
          setUpdateUploadStateIndicator(3);
          break;
        case "graphs3D":
          if (resp[1].startsWith('success')) {
            uploadProgress[resp[0]] = 'success';
          } else {
            uploadProgress[resp[0]] = 'fail';
          }
          setUploadProgress(uploadProgress);
          setFinishedUploading(true);

          setUpdateUploadStateIndicator(4);
          break;
        default: 
          const categories = ['processed', 'graphs2D', 'graphs3D'];
          categories.forEach((name) => { // set to fail if it is finished but still in 'progress'
            if (uploadProgress.hasOwnProperty(name) && uploadProgress[name] === 'progress') {
              uploadProgress[name] = 'fail';
            }
          })
          setUploadProgress(uploadProgress);

          setFinishedUploading(true);
          setUpdateUploadStateIndicator(6);
      }
    });

    process && process.stdout && process.stdout.on('error', (err: string) => {
      err;

      handleResponse('false', action);
      resetUploadState();
      setUpdateUploadStateIndicator(8);
    })

  }

  const beforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file_path = e.target.files && e.target.files[0].path;
    const file_name = e.target.files && e.target.files[0].name; 
    e.target.value = ''; 
    if (file_name && file_name !== "") {
      setUploadFile({...uploadFile, "name": file_name, "path": file_path});
      handleConfirm('upload', file_name);
    }
  }

  const handleUpload = (action = 'upload') => { 

    if (action !== "upload" && action !== "reprocess") return; 

    forceLoadActionHandler.activateForceLoad();

    setUpdateUploadStateIndicator(1);

    if (action === 'upload') {
      setUploadingNotReprocessing(true);
      setUploading(true);

      const pythonProcess = spawn(python3, ['-u', main_script_path, 'csvmat', uploadFile['path'], uploadFile['name']]);
      handleProcess(pythonProcess, action);

    } else if (action === 'reprocess') {
      setUploadingNotReprocessing(false);
      setUploading(true);
      const args = new Array('-u', main_script_path, 'actions', chosenFile, action);
      const pythonProcess = spawn(python3, args);
      handleProcess(pythonProcess, action);
    }

  }

  const frequentStyle = {
    display: chosenFile === "" ? "none" : "flex"
  }

  const buttons = [
    {
      "key": 0,
      "title": <h1>Comments</h1>,
      "icon": <CommentIcon
        color="primary"
        fontSize="large"
      />,
      "style": frequentStyle,
      "onClick": handleComment,
    },
    {
      "key": 1,
      "title": <h1>Reprocess</h1>,
      "icon": <AssessmentIcon 
        color="primary"
        fontSize="large"
      />,
      "style": frequentStyle,
      "onClick": handleReprocess, 
    },
    {
      "key": 2,
      "title": <h1>Save</h1>,
      "icon": <SaveIcon 
        color="primary"
        fontSize="large"
      />,
      "style": frequentStyle,
      "onClick": handleSave, 
    },
    {
      "key": 3,
      "title": <h1>Edit</h1>,
      "icon": <EditIcon 
        color="primary"
        fontSize="large"
      />,
      "style": frequentStyle,
      "onClick": handleEdit, 
    },
    {
      "key": 4,
      "title": <h1>Delete</h1>,
      "icon": <DeleteIcon 
        color="primary"
        fontSize="large"
      />,
      "style": frequentStyle,
      "onClick": handleDelete, 
    },
    {
      "key": 5,
      "title": <h1>Upload</h1>,
      "icon": <CloudUploadIcon 
        color="primary" 
        fontSize="large"
      />,
      "style": {
        display: "flex",
      },
      "onClick": handleFileUpload, 
    },
  ]

  return (

    <ThemeProvider theme={color}>
          <UploadProgress 
            uploadProgress = {uploadProgress} 
            uploading = {uploading} 
            uploadingNotReprocessing = {uploadingNotReprocessing} 
            finishedUploading ={finishedUploading}
            updateUploadStateIndicator = {updateUploadStateIndicator}
            refreshTableView = {props.refreshTableView} 
            resetUploadState = {resetUploadState}
          />

          <LinearProgress id="loader-smaller" color="primary" className={classes.loadingSmaller}/>

          <div className={classes.buttonCont}>

            {buttons.map((obj) => {
              return(
                <Tooltip 
                  title={obj['title']} 
                  arrow
                  >
                      <IconButton 
                        style={obj['style']}
                        onClick={obj['onClick']}
                        >
                        {obj['icon']}
                      </IconButton>
                </Tooltip>
              )
            })}

          </div>

          <input type="file" id="file-upload" style={{display:"none"}} onChange={(e) => {beforeUpload(e)}} ref={upload} accept=".mat, .csv"></input>

          <Confirmation 
            open={openConfirm}
            close={handleCloseConfirm}
            title={confirmInfo['title'] ?? null}
            desc={confirmInfo['description'] ?? null}
            confirm={verifyConfirm}
            reject={rejectConfirm}
          />

          <Notification />

    </ThemeProvider>
  );


  
};

export default FileActions;