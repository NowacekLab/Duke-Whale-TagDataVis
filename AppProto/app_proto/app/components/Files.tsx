import React, { useState } from 'react';
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

const styles = {
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplateRows: "20% 50% 10%",
    gridTemplateColumns: "100%",
    gridTemplateAreas:`
    'header'
    'main'
    'banner'`,
},
bannerCont: {
    width: "250px",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    justifyContent: "center",
    display: "none",
    animation: "all 1s ease-in"
},
bannerErrorCont: {
    width: "250px",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    justifyContent: "center",
    display: "none",
    animation: "all 1s ease-in"
},
banner: {
    boxShadow: "5px 10px",
    marginTop: "10px",
},
  body: {
    display: 'flex',
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    fontSize: "36px",
  },
  header2: {
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    fontSize: "30px",
  },
  header3: {
    color: "grey",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    fontSize: "25px",
  },
  link: {
    opacity: 1,
    textDecoration: "none",
  },
  app: {
    color: "rgba(1,33,105)",
    fontSize: "5em",
    cursor: "pointer",
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 200,
},
  containerStyle: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplateRows: "30% 70%",
    gridTemplateColumns: "100%",
    gridTemplateAreas: `
    'main'`,
  },
  dock: {
    display: "flex",
    justifyContent: "left",
  },
  listItem: {
    color: "black",
    textAlign: "left",
    fontSize: "10px",
  },
  upload: {
    color: "rgba(1,33,105)",
    fontSize: "10em",
    cursor: "pointer",
  },
  upload_hover: {
    color: 'rgba(1,33,105)',
    fontSize: "10em",
    cursor: "pointer",
    backgroundColor: 'rgba(0,0,0,0.1)',
    transition: 'all 0.5s ease',
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
  }
};

const Files = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  // **TO INTERACT WITH PYTHON**
  const fs = window.require('fs');
  const path = require('path');
  const server_path = path.resolve(path.join(__dirname, 'server'))
  const files = path.resolve(path.join(server_path, 'files.json'));
  const script_path = path.resolve(path.join(server_path, 'csvmat.py'));
  const spawn = require("child_process").spawn; 
  

  const [hoverUpload, setHoverUpload] = useState(false);
  // const [file, setFile] = useState('');

  function toggleHoverUpload() {
    setHoverUpload(!hoverUpload);
  }

  const upload = React.useRef(null);

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
            showSuccess();
        } else if (resp === "Timeout") {
            setErrorMessage("File unable to be processed.");
            showError();
        } else {
            setErrorMessage("Error. Please contact developers.");
            showError();
        }
        loader.style.display='none';
    });
  }

  return (
    <Container fluid style={rootStyle} textAlign="center">
      <div style={styles.loading} id="loader">
        <ReactLoading />
      </div>

      <p style={styles.header}>Files</p>
      <div style={styles.body}>
        <div>
          <input type="file" id="file-upload" style={{display: 'none'}} onChange={handleUpload} ref={upload} accept=".mat, .csv">
          </input>
            <BackupIcon style={hoverUpload ? styles.upload_hover : styles.upload} onClick={handleFileUpload} onChange={handleUpload} onMouseEnter={toggleHoverUpload} onMouseLeave={toggleHoverUpload}>
            </BackupIcon>
          <Typography style={styles.text}>
            File Upload
          </Typography>
        </div>
      </div>
      <div id="success-notif-cont" style={styles.bannerCont}>
            <Alert variant="filled" severity="success" style={styles.banner}>
                    Successfully Uploaded
            </Alert>
        </div>
        <div id="error-notif-cont" style={styles.bannerErrorCont}>
            <Alert variant="filled" severity="error" style={styles.banner}>
                    {errorMessage}
            </Alert>
        </div>
      {/* <div style={styles.bannerCont} id="success-notif-cont">
        </div> */}
    </Container>  
  );


  
};

Files.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default Files;