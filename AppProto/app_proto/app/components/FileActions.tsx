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
    }
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
  const [chosenFile, setChosenFile] = useState("");

  const color = createMuiTheme({
    palette: {
        primary: {
            main: "#012069"
        }
    },
  });

  // Executes whenever props.selection changes (interact with table)
  useEffect(() => {
    setChosenFile(props.selection);
  }, new Array(props.selection))

  // Success, Error -- related to messages below
  function showSuccess() {

    props.updater(); // alert to update 

    const notif = document.getElementById('success-notif-cont');
    notif.style.display='flex';
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);    
  }

  function showError() {

      props.updater(); // alert to update 

      const notif = document.getElementById('error-notif-cont');
      notif.style.display='flex';
      setTimeout(() => {
          notif.style.display = 'none';
      }, 5000);
  }

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

  const [message, setMessage] = useState("");

  // Handles the message based on response and action taken 
  function handleResponse(resp, action) {
    if (!(messages.hasOwnProperty(resp))) {
      setMessage("Error. Please contact developers.");
      showError();
    } else {
      setMessage(messages[resp][action]);
      const func = messages[resp]['func'];
      func();
    }
  } 

  // Handlers attached to buttons 
  function handleComment() {
    console.log('placeholder');
  }
  function handleRegenerate() {
    handleUpload('', 'regenerate');
  }
  function handleEdit() {
    handleAction('edit');
  }
  function handleDelete() {
    handleAction('delete');
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
          uploadProgress[resp[0]] = resp[1];
          setUploadProgress(uploadProgress);
          setFinishedUploading(true);

          setLoadingUpdate(4);

          // setTimeout(() => {
          //   handleResponse('True', action);
          //   reset();
          //   setLoadingUpdate(5);
          // }, 500);
          break;
        default: 
          // handleResponse(resp[0], action);
          // reset();
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
   
  const handleUpload = (e, action = 'upload') => { // this function really needs refactoring... but it does for now!

    console.log(action);

    if (action !== "upload" && action !== "regenerate") return; 

    props.setLoading ? props.setLoading(true) : "";
    setLoadingUpdate(1);

    if (action === 'upload') {
      const file_path = e.target.files[0].path;
      const file_name = e.target.files[0].name; 
      e.target.value = '';

      console.log(file_name);

      if (file_name !== "") {
        setIsUploading(true);
        setUploading(true);
        const pythonProcess = spawn('python3', ['-u', script_path, file_path, file_name]);
        handleProcess(pythonProcess, action);
      } else {
        reset();
        return;
      }

    } else if (action === 'regenerate') {
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
      "onClick": handleRegenerate, 
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

          <input type="file" id="file-upload" style={{display:"none"}} onChange={(e) => {handleUpload(e)}} ref={upload} accept=".mat, .csv"></input>

          <div style={styles.bannerSuperCont}>
            <div id="success-notif-cont" style={styles.bannerCont}>
              <Alert variant="filled" severity="success" style={styles.banner}>
                      {message ? message : "Successfully Executed."}
              </Alert>
            </div>
          </div>
          <div style={styles.bannerSuperCont}>
            <div id="error-notif-cont" style={styles.bannerErrorCont}>
              <Alert variant="filled" severity="error" style={styles.banner}>
                      {message ? message : "Error. Please contact developers."}
              </Alert>
            </div>
          </div>
    </ThemeProvider>
  );


  
};

FileActions.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default FileActions;
