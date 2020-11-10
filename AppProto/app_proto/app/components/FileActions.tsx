import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import Alert from '@material-ui/lab/Alert';
import Button from "@material-ui/core/Button";
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
import Notification from "./Notification";

const styles = {
  banner: {
      boxShadow: "5px 10px",
      marginTop: "10px",
  },
  header: {
    color: "white",
    textAlign: "center",
    fontSize: "36px",
  },
  headersubtext: {
    marginTop: "5px"
  },
  loadertext: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5px",
    flexDirection: "column"
  },
  bannerSuperCont: {
    zIndex: 999998,
    bottom: 20,
    left: 200,
    right: 0,
    position: "fixed",
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCont: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },  
  bannerCont: {
    width: "500px",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    animation: "all 1s ease-in",
  },
  bannerErrorCont: {
    width: "500px",
    alignItems: "center",
    justifyContent: "center",
    display: "none",
    animation: "all 1s ease-in",
  },
  loading: {
    display: "none", // none 
    background: "rgba(0,0,0,0.9)",
    position: "fixed", 
    zIndex: 99998,
    bottom: 0,
    top: 0,
    right: 0,
    left: 200,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    },
    loadingSmaller: {
      display: "none",
      position: "fixed",
      zIndex: 99998,
      top: 0,
      left: 200, 
      right: 0,
      height: 5,
    },
};

const FileActions = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  // **TO INTERACT WITH PYTHON**
  const fs = window.require('fs');
  const path = require('path');
  const server_path = path.resolve(path.join(__dirname, 'server'));
  const server_files = path.resolve(path.join(server_path, 'server_files'));
  const files = path.resolve(path.join(server_files, 'files.json'));
  const script_path = path.resolve(path.join(server_path, 'csvmat.py'));
  const action_script_path = path.resolve(path.join(server_path, 'actions.py'));
  const spawn = require("child_process").spawn; 

  // Unrelated to above 
  const upload = React.useRef(null);
  const [chosenFile, setChosenFile] = useState(""); // this is table file selection
  const [uploadFile, setUploadFile] = useState({}); // this is the file to be uploaded 

  const color = createMuiTheme({
    palette: {
        primary: {
            main: "#012069"
        }
    },
  });

  // CONFIRMATION
  const confirmations = {
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
  const [confirmInfo, setConfirmInfo] = useState({});
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
  const fileExists = (file1) => {

    if (file1.endsWith('.mat')) {
      file1 = file1.replace('.mat', '.csv');
    }

    for (const obj of props.rows) {
      let file2 = obj['file'];
      if (file1 === file2) {
        return true;
      }
    }
    return false;
  }
  const handleConfirm = (action: string, uploadFileName) => {

    setPendingAction(action);

    if (action === 'upload') {
      if (fileExists(uploadFileName)) {
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

  // Executes whenever props.selection changes (interact with table)
  useEffect(() => {
    setChosenFile(props.selection);
  }, [props.selection, props.rows])

  const showSuccess = () => {
    setNotifStatus("success");
    setShowNotif(true);
    props.updater();
  }
  const showError = () => {
    setNotifStatus("error");
    setShowNotif(true);
    props.updater();
  }

  // NOTIFICATION STATE
  const [showNotif, setShowNotif] = useState(false);
  const [notifStatus, setNotifStatus] = useState("error");
  // Messages for actions 
  const messages = {
    'True': {
      'func': showSuccess,
      'upload': 'Successfully uploaded and processed.',
      'regenerate': 'Successfully regenerated graphs.',
      'delete': `${chosenFile} deleted.`,
      'edit': `Successfully opened ${chosenFile}`,
      'save': 'Saved in data_visualization folder in Downloads!'
    },
    'False': {
      'func': showError,
      'upload': 'Failed to upload and/or process.',
      'regenerate': 'Failed to regenerate graphs.',
      'delete': 'File could not be deleted.',
      'edit': 'File could not be opened.',
      'save': 'File could not be saved.'
    }
  }

  const [notifMsg, setNotifMsg] = useState("");

  // Handles the message based on response and action taken 
  function handleResponse(resp, action) {
    if (!(messages.hasOwnProperty(resp))) {
      setNotifMsg("Error. Please contact developers.");
      showError();
    } else {
      setNotifMsg(messages[resp][action]);
      const func = messages[resp]['func'];
      func();
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
    upload.current.click();
  }

  // Actual executors...
  function handleAction(action) {

    props.setLoading ? props.setLoading(true) : "";

    const args = new Array('-u', action_script_path, chosenFile, action);

    const pythonProcess = spawn('python3', args);

    const loaderSmaller = document.getElementById('loader-smaller');
    loaderSmaller.style.display='flex';

    pythonProcess.stdout.on('data', (data) => {
      let resp = data.toString().trim();

      handleResponse(resp, action);

      loaderSmaller.style.display = 'none';

      props.setLoading ? props.setLoading(false) : "";

    })
  }
  
  // The below is very ugly! 
  const [isuploading, setIsUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(0);
  const [finishedupload, setFinishedUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    "processed": "progress", 
    "graphs2D": "progress",
    "graphs3D": "progress",
  });

  const reset = () => {

    props.setLoading ? props.setLoading(false) : "";

    setUploadProgress({
      "processed": "progress", 
      "graphs2D": "progress",
      "graphs3D": "progress",
    })

    setLoadingUpdate(0);

    setFinishedUploading(false);
    setUploading(false);
    setIsUploading(false);
  }

  const handleProcess = (process, action) => {

    process.stdout.on('data', (data) => {
      let resp = data.toString().trim();
      resp = resp.split(":");

      console.log(resp);

      switch (resp[0]) {// this will do for now ... not too inefficient because it's just small stream/stages 
        case "processed":
          uploadProgress[resp[0]] = "success"; 
          setUploadProgress(uploadProgress);
          setLoadingUpdate(2); // im going to be honest here and say that I'm not sure why this hard-coded # increment works and a variable + 1 does not
          break;
        case "graphs2D":
          uploadProgress[resp[0]] = resp[1];
          setUploadProgress(uploadProgress);
          setLoadingUpdate(3);
          break;
        case "graphs3D":
          if (resp[1].startsWith('success')) {
            uploadProgress[resp[0]] = 'success';
          } else {
            uploadProgress[resp[0]] = 'fail';
          }
          setUploadProgress(uploadProgress);
          setFinishedUploading(true);

          setLoadingUpdate(4);
          break;
        default: 
          setFinishedUploading(true);
          setLoadingUpdate(6);
      }
    });

    process.stdout.on('error', (err) => {
      handleResponse('false', action);
      reset();
      setLoadingUpdate(8);
    })

  }

  const beforeUpload = (e) => {
    const file_path = e.target.files[0].path;
    const file_name = e.target.files[0].name; 
    e.target.value = ''; 
    if (file_name !== "") {
      setUploadFile({...uploadFile, "name": file_name, "path": file_path});
      handleConfirm('upload', file_name);
    }
  }

  const handleUpload = (action = 'upload') => { // this function really needs refactoring... but it does for now!

    if (action !== "upload" && action !== "reprocess") return; 

    props.setLoading ? props.setLoading(true) : "";
    setLoadingUpdate(1);

    if (action === 'upload') {
      setIsUploading(true);
      setUploading(true);
      const pythonProcess = spawn('python3', ['-u', script_path, uploadFile['path'], uploadFile['name']]);
      handleProcess(pythonProcess, action);

    } else if (action === 'reprocess') {
      setIsUploading(false);
      setUploading(true);
      const args = new Array('-u', action_script_path, chosenFile, action);
      const pythonProcess = spawn('python3', args);
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
            isuploading={isuploading} 
            finishedupload={finishedupload}
            updater = {loadingUpdate}
            refresh = {props.updater} // 'refresh' is to not interfere with 'updater'
            reset = {reset}
          />

          <LinearProgress id="loader-smaller" color="primary" style={styles.loadingSmaller}/>

          <div style={styles.buttonCont}>

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
            title={confirmInfo ? confirmInfo['title'] : null}
            desc={confirmInfo ? confirmInfo['description'] : null}
            confirm={verifyConfirm}
            reject={rejectConfirm}
          />


          <Notification 
            status={notifStatus}
            show={showNotif}
            message={notifMsg}
            setShow={setShowNotif}
          />

    </ThemeProvider>
  );


  
};

FileActions.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default FileActions;