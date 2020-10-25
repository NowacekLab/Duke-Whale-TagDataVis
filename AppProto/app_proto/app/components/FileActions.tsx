import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";
import Typography from '@material-ui/core/Typography';
import BackupIcon from '@material-ui/icons/Backup';
import Alert from '@material-ui/lab/Alert';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ReactLoading from 'react-loading';
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/Icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const styles = {
  banner: {
      boxShadow: "5px 10px",
      marginTop: "10px",
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
    display: "none",
    background: "rgba(0,0,0,0.8)",
    position: "fixed", 
    zIndex: 99998,
    bottom: 0,
    top: 0,
    right: 0,
    left: 200,
    alignItems: "center",
    justifyContent: "center",
    },

    tableUploadButton: {
    marginTop: "15px",
    marginLeft: "5px",
    height: "50px",
    },

    tableDeleteButton: {
      marginTop: "15px",
      height: "50px",
      display: "none"
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


  const upload = React.useRef(null);
  const save = React.useRef(null);

  const [chosenFile, setChosenFile] = useState("");


  useEffect(() => {
    setChosenFile(props.selection);
  }, new Array(props.selection))

  function handleShowDeleteEdit() {
    setChosenFile(props.selection);
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

  function handleAction(action) {

    const args = new Array(action_script_path, chosenFile, action);

    const pythonProcess = spawn('python', args);

    pythonProcess.stdout.on('data', (data) => {
      let resp = data.toString().trim();

      console.log(resp);

      if (resp === "True") {
        if (action === 'delete') {
          setSuccessMessage(`${chosenFile} deleted.`);
          setChosenFile("");
        } else if (action === 'edit') {
          setSuccessMessage(`Successfully opened ${chosenFile}`)
        } else if (action === 'save') {
          setSuccessMessage(`Saved in 'data _visualization' folder in Downloads!`)
        }
        showSuccess();

        props.updater();
      } else if (resp === 'False') {
        if (action === 'delete') {
          setErrorMessage("File could not be deleted.")
        } else if (action === 'edit') {
          setErrorMessage("File could not be opened.")
        }

        showError();
      } else {

        setErrorMessage("Error. Please contact developers.");
        showError();
      }

    })
  }

  function handleFileUpload() {
      upload.current.click();
  }

  function showSuccess() {
    const notif = document.getElementById('success-notif-cont');
    notif.style.display='flex';
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);    
  }

  function showError() {
      const notif = document.getElementById('error-notif-cont');
      notif.style.display='flex';
      setTimeout(() => {
          notif.style.display = 'none';
      }, 5000);
  }


  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpload = e => {

    const file_path = e.target.files[0].path;
    const file_name = e.target.files[0].name; 
    e.target.value = '';
    const pythonProcess = spawn('python', [script_path, file_path, file_name]);

    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    pythonProcess.stdout.on('data', (data) => {
        let resp = data.toString().trim(); 
        if (resp === "True") { 
            setSuccessMessage(`${file_name} processed as CSV.`);
            showSuccess();

            props.updater();

            // console.log('true');
        } else if (resp === "Timeout") {
            setErrorMessage("File unable to be processed.");
            showError();
            // console.log('timeout');
        } else {
            setErrorMessage("Error. Please contact developers.");
            showError();
            // console.log('else');
        }
        loader.style.display='none';
    });
  }

  const color = createMuiTheme({
    palette: {
        primary: {
            main: "#012069"
        }
    },
  });

  return (

    <ThemeProvider theme={color}>
          <div style={styles.loading} id="loader">
            <ReactLoading />
          </div>
          <div>
          <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                style={{
                  marginTop: "15px",
                  height: "50px",
                  display: chosenFile === "" ? "none" : "inline",
                }}
                onClick={handleSave}
            >
                Save
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                style={{
                  marginTop: "15px",
                  marginLeft: "5px",
                  height: "50px",
                  display: chosenFile === "" ? "none" : "inline",
                }}
                onClick={handleEdit}
            >
                Edit
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<DeleteIcon />}
                style={{
                  marginTop: "15px",
                  marginLeft: "5px",
                  height: "50px",
                  display: chosenFile === "" ? "none" : "inline",
                }}
                onClick={handleDelete}
            >
                Delete
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                style={styles.tableUploadButton}
                onClick={handleFileUpload}
            >
                Upload
            </Button>
          </div>
          <input type="file" id="file-upload" style={{display:"none"}} onChange={handleUpload} ref={upload} accept=".mat, .csv"></input>
          <div style={styles.bannerSuperCont}>
            <div id="success-notif-cont" style={styles.bannerCont}>
              <Alert variant="filled" severity="success" style={styles.banner}>
                      {successMessage ? successMessage : "Successfully Executed."}
              </Alert>
            </div>
          </div>
          <div style={styles.bannerSuperCont}>
            <div id="error-notif-cont" style={styles.bannerErrorCont}>
              <Alert variant="filled" severity="error" style={styles.banner}>
                      {errorMessage ? errorMessage : "Error. Please contact developers."}
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