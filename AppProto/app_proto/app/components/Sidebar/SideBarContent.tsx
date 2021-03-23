import React, {useState} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import routes from '../../routes.json';
import SideBarComp from "./SideBarComp";
import HomeIcon from '@material-ui/icons/Home';
import Divider from "@material-ui/core/Divider";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip";
import {useDispatch} from 'react-redux';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import UploadAction from "../Upload/UploadAction";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import AnimatedDialogWrapper from '../Animated/AnimatedDialogWrapper';
import MahalDialogWrapper from '../MahalPOI/MahalDialogWrapper';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsWrapper from '../Settings/SettingsWrapper';

const useStyles = makeStyles({
    content: {
        height: "100%",
        display: 'flex',
        flexDirection: 'column'
    },
    text: {
        fontFamily: "HelveticaNeue-Light",
        color: "#fff",
    },
    bottomBtnCont: {
        position: "absolute",
        bottom: "0px",
        display: "flex",
        width: "100%",
        justifyContent: "space-between"
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
    btnActive: {
        color: "white",
        backgroundColor: "rgba(0,0,0,0.1)",
        transition: "all 0.15s linear",
        backgroundSize: "110% 110%"
    },
    btnInactive: {
        color: "white",
        opacity: 0.5,
        transition: "all 0.15s linear"
    },
    linkDivider: {
        color: "white",
        background: "white",
    }
});

const SideBarContent = () => {

    const classes = useStyles();
    const history = useHistory();

    const dispatch = useDispatch();

    // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
    const notifActionHandler = new notifsActionsHandler(dispatch, "Side Bar Action");

    //@ts-ignore
    const forceLoad = useSelector(state => state.forceLoad);

    const {pathname} = useLocation();

    const isNavEnabled = () => {
        return true;
    }

    const navIfEnabled = (navRoute: string) => {
        const navEnabled = isNavEnabled();
        if (!navEnabled) return;
        history.push(navRoute);
    }

    const [animatedDialogOpen, setAnimatedDialogOpen] = useState(false);
    const handleAnimatedDialogClose = () => {
        setAnimatedDialogOpen(false);
    }
    const [mahalDialogOpen, setMahalDialogOpen] = useState(false);
    const handleMahalDialogClose = () => {
        setMahalDialogOpen(false);
    }
    const [settingsOpen, setSettingsOpen] = useState(false);
    const handleSettingsClose = () => {
        setSettingsOpen(false);
    }

    const [darkMode, setDarkMode] = useState(false);
    const testing = () => {
        // console.log(screen);
        // console.log(screen.getPrimaryDisplay().workAreaSize);
        // console.log(remote.getCurrentWindow().getSize());
        // if (!darkMode) {
        //     document.body.setAttribute('data-theme', 'dark');
        //     setDarkMode(true);
        // } else {
        //     document.body.removeAttribute('data-theme');
        //     setDarkMode(false);
        // }
    }

    return(
        <SideBarComp>
            <div style={{
                height: '100%'
            }}>
                <div className={classes.content}>


                    <UploadAction />

                    <Divider 
                        style={{background: "white"}}
                        variant="middle"
                    />

                    <Tooltip
                        title={
                            <Typography>
                                Home
                            </Typography>
                        }
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={() => {
                                navIfEnabled(routes.HOME)
                            }}
                        >

                            <HomeIcon className={pathname === routes.HOME ? classes.btnActive : classes.btnInactive} />

                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    gap: "10px",
                                    padding: "5px"
                                }}
                            >
                                <Typography>
                                    Data View 
                                </Typography>
                                <Button
                                    onClick={() => {
                                        navIfEnabled(routes.GRAPHS)
                                    }}
                                    style={{
                                        color: "white",
                                        fontWeight: pathname === routes.GRAPHS ? "bolder" : "normal",
                                        border: "1px solid white"
                                    }}
                                >
                                    Created Graphs
                                </Button>
                                <Button
                                    onClick={() => {
                                        navIfEnabled(routes.EDITOR)
                                    }}
                                    style={{
                                        color: "white",
                                        fontWeight: pathname === routes.EDITOR ? "bolder" : "normal",
                                        border: "1px solid white"
                                    }}
                                >
                                    Custom Graphing
                                </Button>
                            </div>
                        }
                        interactive={true}
                        leaveDelay={300}
                        placement="right"
                        arrow 
                    >
                        <IconButton>
                            <EqualizerIcon className={pathname === routes.GRAPHS || pathname === routes.EDITOR ? classes.btnActive : classes.btnInactive} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignContent: 'center',
                                    gap: "10px",
                                    padding: "5px"
                                }}
                            >
                                <Typography>
                                    Generate
                                </Typography>
                                <Button
                                    style={{
                                        color: "white",
                                        fontWeight: "normal",
                                        border: "1px solid white"
                                    }}
                                    onClick={() => setAnimatedDialogOpen(true)}
                                >
                                    3D Animation 
                                </Button>
                                <Button
                                    style={{
                                        color: "white",
                                        fontWeight: "normal",
                                        border: "1px solid white"
                                    }}
                                    onClick={() => setMahalDialogOpen(true)}
                                >
                                    Mahal POI
                                </Button>
                            </div>

                        }
                        interactive={true}
                        leaveDelay={300}
                        placement="right"
                        arrow  
                        disableFocusListener
                    >

                            <IconButton>
                                <ImportExportIcon className={pathname === routes.EXPORT ? classes.btnActive : classes.btnInactive}/>
                            </IconButton>

                    </Tooltip>

                    <AnimatedDialogWrapper 
                        showDialog={animatedDialogOpen}
                        handleClose={handleAnimatedDialogClose}
                        handleBack={handleAnimatedDialogClose}
                    />

                    <MahalDialogWrapper 
                        showDialog={mahalDialogOpen}
                        handleClose={handleMahalDialogClose}
                        handleBack={handleMahalDialogClose}
                    />

                    <Tooltip
                        title={
                            <Typography>
                                Settings
                            </Typography>
                        }
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={() => setSettingsOpen(true)}
                            style={{
                                marginTop: 'auto'
                            }}
                        >

                            <SettingsIcon className={settingsOpen ? classes.btnActive : classes.btnInactive} />

                        </IconButton>
                    </Tooltip>

                    <SettingsWrapper 
                        showDialog={settingsOpen}
                        handleClose={handleSettingsClose}
                        handleBack={handleSettingsClose}
                    />

                </div>

            </div>

        </SideBarComp>
    )

}

export default SideBarContent;