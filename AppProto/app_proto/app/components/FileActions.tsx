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

import UploadDialogCont from "./UploadDialogCont";
import UploadProgress from './UploadProgress';
import Confirmation from "./Confirmation";
import {useDispatch} from 'react-redux';
import Notification from "./Notification";

import useIsMountedRef from "../functions/useIsMountedRef";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import forceLoadActionsHandler from "../functions/forceLoad/forceLoadActionsHandler";
import * as constants from "../app_files/constants";
import {formatCMDLineArgs} from "../functions/exec/execHelpers";
import handlePythonExec from "../functions/exec/pythonHandler";
import * as child from 'child_process';
import {spawn, isWindows, python3, MAIN_SCRIPT_PATH} from "../functions/exec/pythonHandler";

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
  const dispatch = useDispatch();
  const notifActionHandler = new notifsActionsHandler(dispatch);
  const forceLoadActionHandler = new forceLoadActionsHandler(dispatch);

  // **TO INTERACT WITH PYTHON**
  const [chosenFile, setChosenFile] = useState<string>(""); // this is table file selectedFile

  type uploadInfoObject = constants.uploadInfoObject;
  const defaultUploadInfoObj = {
    "dataFileName": "",
    "dataFilePath": "",
    "logFileName": "",
    "logFilePath": "",
    "gpsFileName": "",
    "gpsFilePath": "",
    "startLat": "",
    "startLong": "",
  }
  const [uploadInfoObj, setUploadInfoObject] = useState<uploadInfoObject>(defaultUploadInfoObj);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const handleUploadDialogClose = () => {
    setShowUploadDialog(false);
    cancelFileUpload();
  }
  function handleFileUpload() {
    setShowUploadDialog(true);
    forceLoadActionHandler.activateForceLoad();
  }
  function beginProcessing(begin: boolean, uploadInfoObj: uploadInfoObject) {
    if (!begin) cancelFileUpload();
    else handleConfirm("upload", uploadInfoObj.dataFileName);
  }
  function cancelFileUpload() {
    forceLoadActionHandler.deactivateForceLoad();
    setUploadInfoObject(defaultUploadInfoObj);
    setShowUploadDialog(false);
  }


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
        cancelFileUpload();
        break;
      case "reprocess":
        handleUpload('reprocess');
    }

    handleCloseConfirm();

    setPendingAction("");
  }
  const rejectConfirm = () => {
    if (pendingAction === 'upload') {
      cancelFileUpload();
    }
    handleCloseConfirm();
    setPendingAction("");
  }
  const fileExists = (file1: string) => {

    if (file1 === "") return false;

    if (file1.endsWith('.mat')) {
      file1 = file1.replace('.mat', '.csv');
    }


    console.log(file1);

    for (const obj of props.fileRows) {
      let file2 = obj['file'];

      console.log(file2);

      if (file1 === file2) {
        return true;
      }
    }
    return false;
  }
  const handleConfirm = (action: string, uploadFileName?: string) => {

    setPendingAction(action);
    
    if (action === 'upload') {

      console.log("UPLOADED FILE: " + uploadFileName);

      let obj;
      if (fileExists(uploadFileName ?? "")) {
        obj = confirmations['upload-exists'];
      } else {
        obj = confirmations['upload-new'];
      }
      obj['title'] = obj['title'] + `${uploadFileName}?`;

      setConfirmInfo(obj);
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
  // Actual executors...
  function handleAction(action: string) {

    forceLoadActionHandler.activateForceLoad();

    if (action === 'delete') {
      const currentGraphFile = localStorage.getItem('selectedGraphFile') || "";
      if (currentGraphFile === chosenFile) {
        localStorage.setItem('selectedGraphFile', "");
      }
    }

    const args = new Array('-u', MAIN_SCRIPT_PATH, 'actions', chosenFile, action);

    const pythonProcess = spawn(python3, args, {shell: isWindows});

    //TODO: abstract away this into another function
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

      props.refreshTableView();
      forceLoadActionHandler.deactivateForceLoad();

    })
  }
  
  const [uploading, setUploading] = useState(false);
  const [finishedUploading, setFinishedUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({
    "converted": "progress",
    "processed": "progress", 
    "graphs": "progress",
  });

  const resetUploadState = () => {
    forceLoadActionHandler.deactivateForceLoad();

    setUploadProgress({
      "converted": "progress",
      "processed": "progress", 
      "graphs": "progress",
    })
    setFinishedUploading(false);
    setUploading(false);
  }

  const handleUploadProcess = (process: child.ChildProcess) => {

    process && process.stdout && process.stdout.on('data', (data) => {
      let resp = data.toString().trim();

      console.log(resp);
      console.log(uploadProgress);

      const error = resp === 'Error';

      if (error) {
        for (let key in uploadProgress) {
          if (uploadProgress[key] === 'progress') {
            uploadProgress[key] = 'fail';
          }
        }
        setFinishedUploading(true);
      } else if (uploadProgress.hasOwnProperty(resp)) {
        uploadProgress[resp] = 'success';
      }


      console.log(uploadProgress);
      setUploadProgress({...uploadProgress});
    });

    process && process.stdout && process.stdout.on('error', (err: string) => {
      const action = "";

      handleResponse('false', action);
      resetUploadState();
    })

  }

  const handleUpload = (action = 'upload') => { 

    if (action !== "upload" && action !== "reprocess") return; 

    forceLoadActionHandler.activateForceLoad();
    let cmdLineObj;
    if (action === 'upload') {
      cmdLineObj = {
        'moduleName': 'actions',
        'action': 'upload',
        ...uploadInfoObj,
      }
    } else {
      cmdLineObj = {
        'moduleName': 'actions',
        'action': 'reprocess',
        'fileName': chosenFile
      }
    }

    setUploading(true);
    const cmdLineArg = formatCMDLineArgs(cmdLineObj);
    const args = [cmdLineArg];
    const process = handlePythonExec(handleUploadProcess, handleProcStartError, args);
    process;
          
  }

  function handleProcStartError() {
    notifActionHandler.showErrorNotif("Scripts failed to execute. Contact developers.");

    if (pendingAction === 'upload') {
      resetUploadState();
    }
  }

  const frequentStyle = {
    display: chosenFile === "" ? "none" : "flex"
  }

  const buttons = [
    // {
    //   "key": 0,
    //   "title": <h1>Comments</h1>,
    //   "icon": <CommentIcon
    //     color="primary"
    //     fontSize="large"
    //   />,
    //   "style": frequentStyle,
    //   "onClick": handleComment,
    // },
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
            finishedUploading ={finishedUploading}
            refreshTableView = {props.refreshTableView} 
            resetUploadState = {resetUploadState}
          />

          <UploadDialogCont 
            showUploadDialog={showUploadDialog}
            setUploadInfoObject={setUploadInfoObject}
            beginProcessing={beginProcessing}
            handleUploadDialogClose={handleUploadDialogClose}
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



          <Confirmation 
            open={openConfirm}
            close={handleCloseConfirm}
            title={confirmInfo.hasOwnProperty('title') ? confirmInfo['title'] : null}
            desc={confirmInfo.hasOwnProperty('description') ? confirmInfo['description'] : null}
            confirm={verifyConfirm}
            reject={rejectConfirm}
          />

          <Notification />

    </ThemeProvider>
  );


  
};

export default FileActions;