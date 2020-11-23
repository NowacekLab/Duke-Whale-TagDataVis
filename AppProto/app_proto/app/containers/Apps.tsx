import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import routes from '../server/server_files/routes.json';
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
import useIsMountedRef from "../functions/useIsMountedRef";

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
    app: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
    },
    app_hover: {
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

    const [file, setFile] = useState(localStorage.getItem('file') || "");
    const isMountedRef = useIsMountedRef();

    useEffect(() => {
        checkForGraphs();
      }, new Array(file))
      
    const fs = window.require('fs');
    const path = require('path');
    const isDev = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;
    const server_path = isDev ? path.resolve(path.join(__dirname, 'server')) : path.resolve(path.join(remote.app.getAppPath(), 'server'));    
    const server_files = path.resolve(path.join(server_path, 'server_files'));
    const files = path.resolve(path.join(server_files, 'files.json'));

    // HOVER
    const [hovers, setHovers] = useState<truthMap>({
        "2D": false,
        "3D": false,
        "MIXED": false
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
        'graphsMixed': false,
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
    const [showNotif, setShowNotif] = useState(false);
    const notifMsg = "Graph type not available for selected file.";
    const notifStatus = "error";
    function showError() {
        setShowNotif(true);
    }

    // CLICKABILITY
    const checkForGraphs = () => {
        localStorage.setItem('file', file);
        fs.readFile(files, function(err: string, data: string) {
            err;

            const info = JSON.parse(data);

            if (!(info.hasOwnProperty(file))) {
                localStorage.setItem('file', '');
                return clickablesDisabled;
            }
            const graphs = ['graphs2D', 'graphs3D', 'graphsMixed'];

            var obj: truthMap = {};

            for (let key in graphs) {
                if (info[file].hasOwnProperty(graphs[key])) {
                    let hasGraph = false;
                    for (let name in info[file][graphs[key]]) {
                        if (info[file][graphs[key]][name] !== "") {
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
                            <TrendingUpIcon className={hovers['2D'] ? classes.app_hover : classes.app} onMouseEnter={() => handleHover("2D", true)} onMouseLeave={() => handleHover("2D", false)} />
                       </Link>
        },
        {
            "key": 1,
            "title": "3D Graph",
            "comp": <Link to={routes.GRAPHS} className={classes.link} onClick={(e) => {handleNav(e, 'graphs3D')}}>
                            <GraphicEqIcon className={hovers['3D'] ? classes.app_hover : classes.app} onMouseEnter={() => handleHover("3D", true)} onMouseLeave={() => handleHover("3D", false)}/>
                        </Link>
        },
        {
            "key": 2,
            "title": "Mixed Graph",
            "comp": <Link to={routes.GRAPHS} className={classes.link} onClick={(e) => {handleNav(e, 'graphsMixed')}}>
                            <MultilineChartIcon className={hovers['MIXED'] ? classes.app_hover : classes.app} onMouseEnter={() => handleHover("MIXED", true)} onMouseLeave={() => handleHover("MIXED", false)}/>
                        </Link>
        }

    ]

    return (
            <Container className={classes.root}>
                <p className={classes.header}>Apps</p>
                <div>
                    <div className={classes.apps}>
                        {apps.map((obj) => {
                            return(
                                <div key={obj['title']}>
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
                            <ListItemText primary={file ? file : "No file selected"}/>
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
                        <AppsTable fileSelector={setFile} file={file} closeModal={handleModalClose}/>
                    </Fade>
                </Modal>

                <Notification 
                    status={notifStatus}
                    show={showNotif}
                    message={notifMsg}
                    setShow={setShowNotif}
                />

            </Container>
    );
};

export default Apps;