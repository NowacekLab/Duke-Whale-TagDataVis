import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/Icons/Delete';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CommentIcon from '@material-ui/icons/Comment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

import Confirmation from "../components/Confirmation";
import Notification from "../components/Notification";
import * as url from "url";

import {useDispatch} from "react-redux";
import forceLoadActionsHandler from "../functions/forceLoad/forceLoadActionsHandler";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import useIsMountedRef from "../functions/useIsMountedRef";

const useStyles = makeStyles({
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
    listContainer2: {
        marginTop: "auto",
        marginBottom: "auto",
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
    listSubheader: {
        backgroundColor: "#012069",
        color: "white"
    },
    listFooter: {
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
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(1,32,105,0.9)"
        }
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
});

const Graphs = () => {

    const classes = useStyles();
    
    const fs = window.require('fs');
    const path = require('path');
    const isDev: boolean = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;
    const scripts_path = isDev ? path.resolve(path.join(__dirname, 'scripts')) : path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
    const files = path.resolve(path.join(scripts_path, 'files'));
    const scripts_files = path.resolve(path.join(files, 'scripts_files'));
    const filesJSON = path.resolve(path.join(scripts_files, 'files.json'));
    const file = localStorage.getItem('selectedGraphFile') ?? "";
    const main_script_path = path.resolve(path.join(scripts_path, 'main.py'));
    const spawn = require("child_process").spawn;


    const isWindows = process.platform === "win32";
    const python3 = isWindows ? path.resolve(path.join(scripts_path, 'windows_env', 'Scripts', 'python.exe')) : 
                                path.resolve(path.join(scripts_path, 'mac_env', 'bin','python3'));


    type graphObject = Record<string, string>;
    const [graphs, setGraphs] = useState<Array<graphObject>>([]); 

    const [update, setUpdater] = useState(false);

    const dispatch = useDispatch();
    const forceLoadActionHandler = new forceLoadActionsHandler(dispatch);
    const notifActionHandler = new notifsActionsHandler(dispatch);

    const isMountedRef = useIsMountedRef();

    useEffect(() => {
        getGraphs();
    }, [update])
    
    type messagesObject = Record<string, Record<string, string>>
    const messages: messagesObject = {
        'True': {
        'delete': `Successfully deleted.`,
        'save': 'Saved in data_visualization folder in Downloads!'
        },
        'False': {
        'delete': 'File could not be deleted.',
        'save': 'File could not be saved.'
        }
    }

    // Handles the message based on response and action taken
    function handleResponse(resp: string, action: string) {
        if (!(messages.hasOwnProperty(resp))) {
            notifActionHandler.showErrorNotif("Error. Please contact developers.");
        } else {
            const msg = messages[resp][action];
            if (resp === "True") {
                notifActionHandler.showSuccessNotif(msg);
            } else {
                notifActionHandler.showErrorNotif(msg);
            }
        }
    }

    function handleAction(action: string, obj: graphObject) {

        forceLoadActionHandler.activateForceLoad();

        const FILE = obj['name'];

        const args = new Array(main_script_path, 'actions', FILE, action, file);

        const loadingSmaller = document.getElementById('loader-smaller');

        loadingSmaller ? loadingSmaller.style.display = 'flex' : null;

        const pythonProcess = spawn(python3, args, {shell: isWindows});

        pythonProcess.stdout.on('data', (data: any) => {

            let resp = data.toString().trim();

            console.log(resp);

            handleResponse(resp, action);

            if (action === 'delete') {
                setUpdater(!update);
            }

            loadingSmaller ? loadingSmaller.style.display = 'none' : null;

            forceLoadActionHandler.deactivateForceLoad();

        })
    }

    function handleDelete(obj: graphObject) {
        handleConfirm('delete', obj);
    }
    function handleSave(obj: graphObject) {
        handleAction('save', obj);
    }
    function handleComment(obj: graphObject) {
        obj;
        console.log("placeholder");
    }

    const [graphType, setGraphType] = useState("default");
    type graphChoicesObject = Record<string, Record<string, string>>;
    const graphChoices: graphChoicesObject = {
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

        let graph_type: string = localStorage.getItem('app') ?? "2D";

        isMountedRef.current && setGraphType(graph_type);

        console.log('hi');
        console.log(filesJSON);
        if (filesJSON) {
            fs.readFile(filesJSON, function(error: string, data: string) {
                error;
    
                const info = JSON.parse(data);
    
                if (!(info.hasOwnProperty(file))) {
                    return;
                }
    
                const graph_key = graphChoices[graph_type]['key'];
    
                if (info[file].hasOwnProperty(graph_key)) {
                    let new_graphs: Array<graphObject> = [];
                    for (let key in info[file][graph_key]) {
                        let graph: graphObject = {};
                        graph['name'] = key;
                        graph['path'] = info[file][graph_key][key];
                        if (graph['path'] !== "") {
                            new_graphs.push(graph);
                        }
                    }
                    setTimeout(() => {
                        isMountedRef.current && setGraphs(new_graphs);
                    }, 300);
                }
            })
        }
    }

    const createBrowserWindow = (name: string, path: string) => {

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

    const [selected, setSelected] = useState<Array<graphObject>>([]);

    const handleToggle = (obj: graphObject) => () => {
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
            notifActionHandler.showErrorNotif("No graphs ahve been selected.");
        } else {
            selected.forEach((obj, i) => {
                i;
                createBrowserWindow(obj['name'], obj['path']);
            });
            notifActionHandler.showSuccessNotif(`${selected.length} graphs have been generated`);
        }
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

    type buttonsArr = Array<Record<string, any>>;
    const buttons: buttonsArr = [
        // {
        //     "key": 0,
        //     "title": <h1>Comments</h1>,
        //     "icon": <CommentIcon />,
        //     "onClick": handleComment,
        // },
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

    const loadingSmallerStyle = makeStyles({
        loadingSmaller: {
            display: graphs.length > 0 ? "none" : "flex",
            position: "fixed",
            zIndex: 99998,
            top: 0,
            left: 200,
            right: 0,
            height: 5,
        }
    });
    const loadingSmallerClass = loadingSmallerStyle();

// CONFIRMATION
    type confirmationsObject = Record<string, Record<string, string>>;
    const confirmations: confirmationsObject = {
        "delete": {
        "title": `Delete `,
        "description": `This will permanently delete the file. ${file} will need to be reprocessed
        to get access again.`
        },
    }
    type confirmInfoObject = Record<string, string>;
    const [confirmInfo, setConfirmInfo] = useState<confirmInfoObject>({});
    const [chosenObj, setChosenObj] = useState<graphObject>({});
    const [pendingAction, setPendingAction] = useState("");
    const [openConfirm, setOpenConfirm] = useState(false);
    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    }
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    }
    const verifyConfirm = () => {
        if (pendingAction === 'delete') {
        handleAction('delete', chosenObj);
        }
        handleCloseConfirm();
        setPendingAction("");
        setChosenObj({});
    }
    const rejectConfirm = () => {
        handleCloseConfirm();
        setPendingAction("");
        setChosenObj({});
    }
    const handleConfirm = (action: string, obj: graphObject) => {

        setPendingAction(action);
        setChosenObj(obj);
        const info = confirmations[action];
        info['title'] = info['title'] + `${obj['name']}?`;
        setConfirmInfo(info);
        handleOpenConfirm();
    }

    return (
        <Container className={classes.root}>

            <LinearProgress id="loader-smaller" color="primary" className={loadingSmallerClass.loadingSmaller}/>

            <p className={classes.header}>{graphChoices[graphType]['title']}</p>
            <div className={graphs.length > 0 ? classes.listContainer : classes.listContainer2}>
                {


                    graphs.length > 0 ?


                    <List className={classes.list} subheader={<ListSubheader className={classes.listSubheader}>{file}</ListSubheader>}>
                        {graphs.map((obj) => {
                            return (
                                <ListItem 
                                    className={classes.listItem} 
                                    key={obj['name']} 
                                    dense 
                                    button 
                                    onClick={handleToggle(obj)}
                                >
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
                                                    key={btn['title']}
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

                {
                
                graphs.length > 0 ?

                
                            <div className={classes.listFooter}>
                                <p className={classes.listInfo}>{graphNumber()}</p>
                                {/* SCROLL TO SEE ALL -- WAS HERE */}
                                <Button
                                    variant="contained"
                                    onClick={handleClick}
                                    className={classes.generateButton}
                                >
                                    Generate
                                </Button>
                            </div>

                            :

                            <Skeleton variant="text" width="100%" height={50}/>

                }

                <Confirmation
                    open={openConfirm}
                    close={handleCloseConfirm}
                    title={confirmInfo ? confirmInfo['title'] : ""}
                    desc={confirmInfo ? confirmInfo['description'] : ""}
                    confirm={verifyConfirm}
                    reject={rejectConfirm}
                />

                <Notification />

            </div>
        </Container>
    );
  };

  export default Graphs;
