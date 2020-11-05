import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import Alert from '@material-ui/lab/Alert';
import ReactLoading from 'react-loading';
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import AddCommentIcon from '@material-ui/icons/AddComment';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/Icons/Delete';
import AssessmentIcon from '@material-ui/icons/Assessment';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';

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
    left: 0,
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
  const server_path = path.resolve(path.join(__dirname, 'server'))
  const files = path.resolve(path.join(server_path, 'files.json'));
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
    handleAction('regenerate');
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

    const args = new Array(action_script_path, chosenFile, action);

    const pythonProcess = spawn('python3', args);

    const loader = document.getElementById('loader');
    const loaderSmaller = document.getElementById('loader-smaller');

    if (action === 'regenerate') {
      loader.style.display = 'flex';
    } else {
      loaderSmaller.style.display='flex';
    }

    pythonProcess.stdout.on('data', (data) => {
      let resp = data.toString().trim();

      handleResponse(resp, action);

      if (action === 'regenerate') {
        loader.style.display='none';
      } else {
        loaderSmaller.style.display = 'none';
      }
    })
  }

  const handleUpload = e => {

    const file_path = e.target.files[0].path;
    const file_name = e.target.files[0].name; 

    e.target.value = '';
    const pythonProcess = spawn('python3', [script_path, file_path, file_name]);

    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    pythonProcess.stdout.on('data', (data) => {
        let resp = data.toString().trim();

        const action = 'upload';

        handleResponse(resp, action);
      
        loader.style.display='none';
    });
  }

  const frequentStyle = {
    display: chosenFile === "" ? "none" : "flex"
  }

  const buttons = [
    {
      "key": 0,
      "title": <h1>Add Comment</h1>,
      "icon": <AddCommentIcon
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
          <div style={styles.loading} id="loader">
            <div style={styles.loadertext}>
              <span style={styles.header}>This may take a while...</span>
              <span style={styles.headersubtext}>Please do not close or change the page</span>
            </div>
            <ReactLoading />
          </div>

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

          <input type="file" id="file-upload" style={{display:"none"}} onChange={handleUpload} ref={upload} accept=".mat, .csv"></input>

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

{/* <div id="success-notif-cont" style={styles.bannerCont}>
<Alert variant="filled" severity="success" style={styles.banner}>
        Successfully Uploaded
</Alert>
</div>
<div id="error-notif-cont" style={styles.bannerErrorCont}>
<Alert variant="filled" severity="error" style={styles.banner}>
        {errorMessage}
</Alert>
</div> */}