import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container} from 'semantic-ui-react';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';

import AppsTable from "./AppsTable";

const styles = {
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
        textAlign: "center",
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
    dock: {
        display: "flex",
        justifyContent: "space-around",
    },
    text: {
        color: "black",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: 200,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: "fixed",
        left: 200,
        background: "rgba(0,0,0,0.8)"
    },
    selectButton: {
        marginTop: "50px",
        backgroundColor: "#012069",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto"
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

const Apps = props => {
    const rootStyle = props.style 
    ? {...styles.root, ...props.style}
    : {...styles.root}

    const [file, setFile] = useState(localStorage.getItem('file') || "");

    useEffect(() => {
        if (!(file === "")) {
            checkForGraphs();
        }
      }, new Array(file))
      
  const fs = window.require('fs');
  const path = require('path');
  const server_path = path.resolve(path.join(__dirname, 'server'))
  const files = path.resolve(path.join(server_path, 'files.json'));

    // HOVER
    const [hover2D, setHover2D] = useState(false);
    const [hover3D, setHover3D] = useState(false);
    const [hoverMIX, setHoverMIX] = useState(false);

    // Clickability 
    const [graphs2D, setGraphs2D] = useState({});
    const [graphs3D, setGraphs3D] = useState({});
    const [graphsMixed, setGraphsMixed] = useState({});

    const [showModal, setShowModal] = useState(false);

    const handleModalOpen = () => {
        setShowModal(true);
    };
    const handleModalClose = () => {
        setShowModal(false);
    };
    const toggleHover2D = (e) => {
        setHover2D(!hover2D);
    };
    const toggleHover3D = (e) => {
        setHover3D(!hover3D);
    };
    const toggleHoverMIX = (e) => {
        setHoverMIX(!hoverMIX);
    };

    // Error, no graphs
    function showError() {
        const notif = document.getElementById('error-notif-cont');
        notif.style.display='flex';
        setTimeout(() => {
            notif.style.display = 'none';
        }, 5000);
    }

    const checkForGraphs = () => {
        localStorage.setItem('file', file);
        fs.readFile(files, function(err, data) {
            const info = JSON.parse(data);

            if (!(info.hasOwnProperty(file))) {
                return;
            }
            const graphs = ['graphs2D', 'graphs3D', 'graphsMixed'];
            const setters =[setGraphs2D, setGraphs3D, setGraphsMixed];
            // check if graphsMixed is right name 
            // graphs2D, graphs3D
            for (let key in graphs) {
                if (info[file].hasOwnProperty(graphs[key])) {
                    setters[key](info[file][graphs[key]]);
                }
            }

        })
    }

    const objEmpty = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    return (
            <Container fluid style={rootStyle} textAlign="center">
                <p style={styles.header}>Apps</p>
                <div>
                    <div style={styles.dock}>
                        <div>
                            {
                                objEmpty(graphs2D) ? 
                                <TrendingUpIcon onClick={showError} style={hover2D ? styles.app_hover : styles.app} onMouseEnter={toggleHover2D} onMouseLeave={toggleHover2D} />
                                :
                                <Link to={{
                                    pathname: routes.GRAPH2D,
                                    state: {
                                        chosen: "",
                                    }
                                    }} style={styles.link}>
                                    <TrendingUpIcon style={hover2D ? styles.app_hover : styles.app} onMouseEnter={toggleHover2D} onMouseLeave={toggleHover2D} />
                                </Link>
                            }
                            <Typography style={styles.text}>
                                        2D Graph
                            </Typography>
                        </div>
                        <div>
                            {
                                objEmpty(graphs3D) ?
                                <GraphicEqIcon onClick={showError} style={hover3D ? styles.app_hover : styles.app} onMouseEnter={toggleHover3D} onMouseLeave={toggleHover3D}/>
                                :
                                <Link to={routes.GRAPH3D} style={styles.link}>
                                    <GraphicEqIcon style={hover3D ? styles.app_hover : styles.app} onMouseEnter={toggleHover3D} onMouseLeave={toggleHover3D}/>
                                </Link>
                            }
                            <Typography style={styles.text}>
                                    3D Graph
                            </Typography>
                        </div>
                        <div>
                            {
                                objEmpty(graphsMixed) ?
                                <MultilineChartIcon onClick={showError} style={hoverMIX ? styles.app_hover : styles.app} onMouseEnter={toggleHoverMIX} onMouseLeave={toggleHoverMIX}/>
                                :
                                <Link to={routes.GRAPHMIX} style={styles.link}>
                                    <MultilineChartIcon style={hoverMIX ? styles.app_hover : styles.app} onMouseEnter={toggleHoverMIX} onMouseLeave={toggleHoverMIX}/>
                                </Link>
                            }
                            <Typography style={styles.text}>
                                    Mixed
                            </Typography>
                        </div>
                    </div>

                    <List style={styles.selectButton}>
                        <ListItem button onClick={handleModalOpen} style={{color: "white"}}>
                            <ListItemText primary={file ? file : "No file selected"}/>
                            <ExpandMore />
                        </ListItem>
                    </List>
                </div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    style={styles.modal}
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
                <div style={styles.bannerSuperCont}>
                    <div id="error-notif-cont" style={styles.bannerErrorCont}>
                    <Alert variant="filled" severity="error" style={styles.banner}>
                            {"Graph type not available for selected file."}
                    </Alert>
                    </div>
                </div>
            </Container>
    );
};

export default Apps;