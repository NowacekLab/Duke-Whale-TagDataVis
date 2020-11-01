import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container, Icon} from "semantic-ui-react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Alert from '@material-ui/lab/Alert';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/Icons/Delete';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as url from "url";

const styles = {
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "10% 80%",
        gridTemplateColumns: "100%",
        gridTemplateAreas:`
        'header'
        'main'`,
    },
    header: {
        color: "black",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        fontSize: "36px",
    },
    plot: {
        marginLeft: "auto",
        marginRight: "auto",
    },
    listContainer: {
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    list: {
        width: "100%",
    },
    listItem: {
        display: "flex",
        justifyContent: "space-around",
    },
    listsubheader: {
        backgroundColor: "#012069",
        color: "white"
    },
    listfooter: {
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    filecounter: {
        position: "absolute",
        left: 0,
        color: "black"
    },
    generateButton: {
        marginTop: "20px",
        backgroundColor: "#012069",
        color: "white"
    },
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
};

  
const Comp3D = props => {
    const rootStyle = props.style
      ? { ...styles.root, ...props.style }
      : { ...styles.root }
    const fs = window.require('fs');
    const path = require('path');
    const server_path = path.resolve(path.join(__dirname, 'server'))
    const files = path.resolve(path.join(server_path, 'files.json'));
    const file = localStorage.getItem('file');
    const action_script_path = path.resolve(path.join(server_path, 'actions.py'));
    const spawn = require("child_process").spawn; 

    const [graphs3D, setGraphs3D] = useState([]);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [update, setUpdater] = useState(false);

    useEffect(() => {
        getGraphs();
      }, new Array(update))
    
    function handleAction(action, obj) {

        const FILE = obj['name'];
        const PATH = obj['path'];

        const args = new Array(action_script_path, FILE, action, PATH);

        const pythonProcess = spawn('python3', args);

        pythonProcess.stdout.on('data', (data) => {

            let resp = data.toString().trim();

            console.log(resp);

            if (resp === "True") {
                if (action === 'delete') {
                    setSuccessMessage(`${FILE} deleted.`);
                } else if (action === 'save') {
                    setSuccessMessage(`Saved in 'data _visualization' folder in Downloads!`)
                }
                showSuccess();

                setUpdater(!update);

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

    function handleDelete(obj) {

        console.log("DELETE");

        handleAction('delete', obj);
    }
    function handleSave(obj) {

        console.log("SAVE");

        handleAction('save', obj);
    }


    const getGraphs = () => {
        fs.readFile(files, function(err, data) {
            const info = JSON.parse(data);

            if (!(info.hasOwnProperty(file))) {
                return;
            }

            if (info[file].hasOwnProperty('graphs3D')) {
                let graphs = new Array();
                for (let key in info[file]['graphs3D']) {
                    let graph3D = new Object();
                    graph3D['name'] = key;
                    graph3D['path'] = info[file]['graphs3D'][key];
                    graphs.push(graph3D);
                }
                setGraphs3D(graphs);
            }
        })
    }


    const createBrowserWindow = (name, path) => {

        const remote = require('electron').remote;
        const BrowserWindow = remote.BrowserWindow; 
        const win = new BrowserWindow({
            height: 600,
            width: 800,
            title: name,
        });
    
        win.loadURL(url.format({
            pathname: 'file://' + path,
        }));
    }

    const [selected, setSelected] = useState([]);

    const handleToggle = (obj) => () => {
        const currentIndex = selected.map(ob => ob['name']).indexOf(obj['name']);
        const newSelected = [...selected];

        if (currentIndex === -1) {
            newSelected.push(obj);
        } else {
            newSelected.splice(currentIndex, 1);
        }

        setSelected(newSelected);
    }

    const handleClick = () => {
        if (selected.length === 0) {
            setErrorMessage("No graphs have been selected.");
            showError();
            return;
        }
        selected.forEach((obj, i) => {
            createBrowserWindow(obj['name'], obj['path']);
        });
        setSuccessMessage(`${selected.length} graphs have been generated.`);
        showSuccess();
    }

    // Error, no graphs selected
    function showError() {
        const notif = document.getElementById('error-notif-cont');
        notif.style.display='flex';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 5000);
    }

    function showSuccess() {
        const notif = document.getElementById('success-notif-cont');
        notif.style.display='flex';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 3000);    
    }

    const graphNumber = () => {
        let graphNumber = graphs3D ? graphs3D.length : 0;

        switch (graphNumber) {
          case 0: 
            return `No Graphs`
          case 1:
            return `1 Graph`
          default:
            return `${graphNumber} Graphs`
        }
    }
  
    return (
        <Container fluid style={rootStyle} textAlign="center">
            <p style={styles.header}>3D Graphs</p>
            <div style={styles.listContainer}>
                <List style={styles.list} subheader={<ListSubheader style={styles.listsubheader}>{file}</ListSubheader>}>
                    {graphs3D ?
                        graphs3D.map((obj) => {
                            
                            return (
                                <ListItem style={styles.listItem} key={obj['name']} dense button onClick={handleToggle(obj)}>
                                    <ListItemIcon>
                                        <Checkbox 
                                            edge="start"
                                            checked={selected.map(ob => ob['name']).indexOf(obj['name']) !== -1}
                                            tabIndex = {-1}
                                            disableRipple 
                                            style = {{
                                                color: '#012069'
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText style={{color: "black"}} id={obj['name']} primary={obj['name']} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() => handleSave(obj)}>
                                            <SaveIcon/>
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(obj)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })
                        :
                        <div></div>
                }
                </List>

                <div style={styles.listfooter}>
                    <p style={styles.filecounter}>{graphNumber()}</p>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        style={styles.generateButton}
                    >
                        Generate
                    </Button>
                </div>


                <div style={styles.bannerSuperCont}>
                    <div id="success-notif-cont" style={styles.bannerCont}>
                    <Alert variant="filled" severity="success" style={styles.banner}>
                            {successMessage === "" ? "Success!" : successMessage}
                    </Alert>
                    </div>
                </div>
                <div style={styles.bannerSuperCont}>
                    <div id="error-notif-cont" style={styles.bannerErrorCont}>
                    <Alert variant="filled" severity="error" style={styles.banner}>
                            {errorMessage === "" ? "Error." : errorMessage}
                    </Alert>
                    </div>
                </div>
            </div>
        </Container>
    );
  };
  
//   Comp2D.propTypes = {
//     style: PropTypes.object,
//     title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     children: PropTypes.object
//   };
  
  export default Comp3D;
