import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import routes from '../scripts/files/scripts_files/routes.json';
import Container from '@material-ui/core/Container';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMore from '@material-ui/icons/ExpandMore';

import AppsTable from "../components/AppsTable";
import Notification from "../components/Notification";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import useIsMountedRef from "../functions/useIsMountedRef";

import {fs, FILES_JSON} from "../functions/exec/pythonHandler";

const useStyles = makeStyles({
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "30% 70%",
        gridTemplateColumns: "100%",
        gridTemplateAreas:`
        'header'
        'main'`,
    },
    header: {
        color: "black",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "36px",
    },
    link: {
        opacity: 1,
        textDecoration: "none",
    },
    appIcon: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
    },
    appIconHover: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
        backgroundColor: "rgba(0,0,0,0.1)",
        transition: "all 0.5s ease",
    },
    apps: {
        display: "flex",
        justifyContent: "space-around",
    },
    app: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    app_title: {
        color: "black",
        fontSize: "20px",
        fontWeight: 200,
    },
    modal: {
        position: "absolute",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "rgba(0,0,0,0.8)"
    },
    selectButton: {
        marginTop: "50px",
        backgroundColor: "#012069",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
    },
});

const Apps = () => {
    const classes = useStyles();
    const isMountedRef = useIsMountedRef();

    //TODO: Convert to Redux 
    const [selectedGraphFile, setSelectedGraphFile] = useState(localStorage.getItem('selectedGraphFile') || "");

    useEffect(() => {
        checkForGraphs();
    }, [selectedGraphFile])
    

    // HOVER
    type truthMap = Record<string, boolean>; 
    const [hovers, setHovers] = useState<truthMap>({
        "2D": false,
        "3D": false,
    });

    const handleHover = (type: string, hovering: boolean) => {

        localStorage.setItem('app', type);

        var obj = Object.create(hovers);
        obj[type] = hovering;
        setHovers(obj);
    };

    // Clickability (there are processed graph files associated with chosen file)
    const clickablesDisabled = {
        'graphs2D': false,
        'graphs3D': false,
    }
    const [clickables, setClickables] = useState<truthMap>(clickablesDisabled);

    // Modal
    const [showModal, setShowModal] = useState(false);
    const handleModalOpen = () => {
        setShowModal(true);
    };
    const handleModalClose = () => {
        setShowModal(false);
    };


    // NOTIFICATION
    const notifMsg = "Graph type not available for selected file.";
    const dispatch = useDispatch();
    const notifsActionHandler = new notifsActionsHandler(dispatch);
    function showError() {
        notifsActionHandler.showErrorNotif(notifMsg);
    }


    // CLICKABILITY
    const checkForGraphs = () => {
        localStorage.setItem('selectedGraphFile', selectedGraphFile);
        try {
            fs.readFile(FILES_JSON, function(err: string, data: string) {
                err;
    
                const info = JSON.parse(data);
    
                if (!(info.hasOwnProperty(selectedGraphFile))) {
                    localStorage.setItem('selectedGraphFile', '');
                    return clickablesDisabled;
                }
                const graphs = ['graphs2D', 'graphs3D'];
    
                var obj: truthMap = {};
    
                for (let key in graphs) {
                    if (info[selectedGraphFile].hasOwnProperty(graphs[key])) {
                        let hasGraph = false;
                        for (let name in info[selectedGraphFile][graphs[key]]) {
                            if (info[selectedGraphFile][graphs[key]][name] !== "") {
                                hasGraph = true;
                                break;
                            }
                        }
                        obj[graphs[key]] = hasGraph;
                    }
                }
    
                isMountedRef.current && setClickables(obj);
                
                return;
            })
        } catch {
            console.log("App.tsx error reading json file.")
        }
    }

    const handleNav = (e: React.MouseEvent<HTMLElement>, graph_type: string) => {
        if (!clickables[graph_type]) {
            e.preventDefault();
            showError();
        }
    }

    const apps = [
        {
            "key": 0,
            "title": "2D Graph",
            "comp": <Link to={routes.GRAPHS} className={classes.link} onClick={(e) => {handleNav(e, 'graphs2D')}}>
                            <TrendingUpIcon className={hovers['2D'] ? classes.appIconHover : classes.appIcon} onMouseEnter={() => handleHover("2D", true)} onMouseLeave={() => handleHover("2D", false)} />
                    </Link>
        },
        {
            "key": 1,
            "title": "3D Graph",
            "comp": <Link to={routes.GRAPHS} className={classes.link} onClick={(e) => {handleNav(e, 'graphs3D')}}>
                            <GraphicEqIcon className={hovers['3D'] ? classes.appIconHover : classes.appIcon} onMouseEnter={() => handleHover("3D", true)} onMouseLeave={() => handleHover("3D", false)}/>
                        </Link>
        },
    ]

    return (
            <Container className={classes.root}>
                <p className={classes.header}>Apps</p>
                <div>
                    <div className={classes.apps}>
                        {apps.map((obj) => {
                            return(
                                <div 
                                    key={obj['title']}
                                    className={classes.app}
                                >
                                    {obj['comp']}
                                    <Typography className={classes.app_title}>
                                        {obj['title']}
                                    </Typography>   
                                </div>
                            )

                        })}
                    </div>

                    <List className={classes.selectButton}>
                        <ListItem button onClick={handleModalOpen} style={{color: "white"}}>
                            <ListItemText primary={selectedGraphFile ? selectedGraphFile : "No file selected"}/>
                            <ExpandMore />
                        </ListItem>
                    </List>
                </div>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    style={{left: "200px"}}
                    open={showModal}
                    onClose={handleModalClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                        style: {
                            position: 'fixed', 
                            left: 200
                        }
                    }}
                >
                    <Fade in={showModal}>
                        <AppsTable setSelectedGraphFile={setSelectedGraphFile} selectedGraphFile={selectedGraphFile} closeModal={handleModalClose}/>
                    </Fade>
                </Modal>

                <Notification />

            </Container>
    );
};

export default Apps;