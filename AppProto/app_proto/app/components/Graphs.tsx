import React, { useState, useEffect } from 'react';
import {Container, Icon} from "semantic-ui-react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/Icons/Delete';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CommentIcon from '@material-ui/icons/Comment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

import * as url from "url";

const styles = {
    root: {
        position: 'relative',
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
        overflow: "auto",
        position: "relative"
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
    listInfo: {
        position: "absolute",
        left: 0,
        color: "black",
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

const Graphs = props => {
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

    const [graphs, setGraphs] = useState([]);

    const [update, setUpdater] = useState(false);

    useEffect(() => {
        getGraphs();
      }, new Array(update))
    
    function showNotif() {
        const notif = document.getElementById('notif-cont');
        notif.style.display='flex';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 5000);
    }
    
    // Messages for actions
    const [response, setResponse] = useState("True");
    const [message, setMessage] = useState("");

    const messages = {
        'True': {
        'delete': `Successfully deleted.`,
        'save': 'Saved in data_visualization folder in Downloads!',
        'component':             <Alert variant="filled" severity="success" style={styles.banner}>
                                    {message}
                                </Alert>
        },
        'False': {
        'delete': 'File could not be deleted.',
        'save': 'File could not be saved.',
        'component':             <Alert variant="filled" severity="error" style={styles.banner}>
                                    {message}
                                </Alert>
        }
    }

    // Handles the message based on response and action taken 
    function handleResponse(resp, action) {
        if (!(messages.hasOwnProperty(resp))) {
            setMessage("Error. Please contact developers.");
            setResponse('False');
        } else {
            setMessage(messages[resp][action]);
            setResponse(resp);
        }
        showNotif();
    } 
    
    function handleAction(action, obj) {

        props.setLoading ? props.setLoading(true) : "";

        const FILE = obj['name'];

        const args = new Array(action_script_path, FILE, action, file);

        const loadingSmaller = document.getElementById('loader-smaller');

        loadingSmaller.style.display = 'flex';

        const pythonProcess = spawn('python3', args);

        pythonProcess.stdout.on('data', (data) => {

            let resp = data.toString().trim();

            console.log(resp);

            handleResponse(resp, action);

            if (action === 'delete') {
                setUpdater(!update);
            }

            loadingSmaller.style.display = 'none';

            props.setLoading ? props.setLoading(false) : "";

        })
    }

    function handleDelete(obj) {
        handleAction('delete', obj);
    }
    function handleSave(obj) {
        handleAction('save', obj);
    }
    function handleComment(obj) {
        console.log("placeholder");
    }

    const [graphType, setGraphType] = useState("default");
    const graphChoices = {
        '2D': {
            'title': '2D Graphs',
            'key': 'graphs2D'
        },
        '3D': {
            'title': '3D Graphs',
            'key': 'graphs3D'
        },
        'MIXED': {
            'title': 'Mixed Graphs',
            'key': 'graphsMixed'
        },
        "default": {
            'title': `${localStorage.getItem('app')} Graphs`
        }
    }
    const getGraphs = () => {

        let graph_type = localStorage.getItem('app');

        graph_type = graph_type ? graph_type : "2D"; // defaults to 2D 

        setGraphType(graph_type);

        fs.readFile(files, function(err, data) {
            const info = JSON.parse(data);
            if (!(info.hasOwnProperty(file))) {
                return;
            }
            
            const graph_key = graphChoices[graph_type]['key'];

            if (info[file].hasOwnProperty(graph_key)) {
                let new_graphs = new Array();
                for (let key in info[file][graph_key]) {
                    let graph = new Object();
                    graph['name'] = key;
                    graph['path'] = info[file][graph_key][key];
                    if (graph['path'] !== "") {
                        new_graphs.push(graph);
                    }
                }
                setTimeout(() => {
                    setGraphs(new_graphs);
                }, 300);
            }
        })
    }

    const createBrowserWindow = (name, path) => {

        const remote = require('electron').remote;
        const BrowserWindow = remote.BrowserWindow; 
        const win = new BrowserWindow({
            height: 800,
            width: 1000,
            title: `${file} : ${name}`,
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
            setMessage("No graphs have been selected.");
            setResponse("False");
        } else {
            selected.forEach((obj, i) => {
                createBrowserWindow(obj['name'], obj['path']);
            });
            setMessage(`${selected.length} graphs have been generated.`);
            setResponse("True");
        }
        showNotif();
    }

    const graphNumber = () => {
        let graphNumber = graphs ? graphs.length : 0;

        switch (graphNumber) {
          case 0: 
            return `No Graphs`
          case 1:
            return `1 Graph`
          default:
            return `${graphNumber} Graphs`
        }
    }

    const buttons = [
        {
            "key": 0,
            "title": <h1>Comments</h1>,
            "icon": <CommentIcon />,
            "onClick": handleComment,
        },
        {
            "key": 1,
            "title": <h1>Save</h1>,
            "icon": <SaveIcon />,
            "onClick": handleSave,
        },
        {
            "key": 2, 
            "title": <h1>Delete</h1>,
            "icon": <DeleteIcon />,
            "onClick": handleDelete,
        },
    ]

    const loadingSmaller = {
        display: graphs.length > 0 ? "none" : "flex",
        position: "fixed",
        zIndex: 99998,
        top: 0,
        left: 200, 
        right: 0,
        height: 5,
    }
  
    return (
        <Container fluid style={rootStyle} textAlign="center">

            <LinearProgress id="loader-smaller" color="primary" style={loadingSmaller}/>

            <p style={styles.header}>{graphChoices[graphType]['title']}</p>
            <div style={graphs.length > 0 ? styles.listContainer : {marginTop: "auto", marginBottom: "auto"}}>
                {
                    graphs.length > 0 ? 
                    <List style={styles.list} subheader={<ListSubheader style={styles.listsubheader}>{file}</ListSubheader>}>
                        {graphs.map((obj) => {
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
                                        {buttons.map((btn) => {

                                            return(
                                                <Tooltip
                                                    title={btn['title']}
                                                    arrow
                                                >
                                                    <IconButton onClick={() => btn['onClick'](obj)}>
                                                        {btn['icon']}
                                                    </IconButton>

                                                </Tooltip>
                                            )
                                        })}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}                        
                    </List>

                    :

                    <div style={{padding: "20px"}}>
                        <Skeleton variant="text" width="100%" height={30} />
                        <Skeleton variant="rect" height={500}/>
                    </div>
                }
                
                {graphs.length > 0 ? 
                            <div style={styles.listfooter}>
                                <p style={styles.listInfo}>{graphNumber()}</p>
                                {/* SCROLL TO SEE ALL -- WAS HERE */}
                                <Button
                                    variant="contained"
                                    onClick={handleClick}
                                    style={styles.generateButton}
                                >
                                    Generate
                                </Button>
                            </div>

                            :

                            <Skeleton variant="text" width="100%" height={50}/>
                
                }

                <div style={styles.bannerSuperCont}>
                    <div id="notif-cont" style={styles.bannerCont}>
                        {messages[response]['component']}
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
  
  export default Graphs;
