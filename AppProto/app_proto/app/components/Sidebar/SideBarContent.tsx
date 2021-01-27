import React, {useState} from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import routes from '../../routes.json';
import SideBarComp from "./SideBarComp";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useUpload, {uploadArgs, resetUploadProgress} from "../../functions/hooks/useUpload";
import UploadDialog from "../Upload/UploadDialog";
import Divider from "@material-ui/core/Divider";
import { Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import EqualizerIcon from '@material-ui/icons/Equalizer';

const useStyles = makeStyles({
    content: {
        height: "100%",
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
const styles = {
    sidebarLink: {
        display: "block",
        padding: "16px 16px",
        color: "white",
        textDecoration: "none",
    },
    active_upload_btn: {
        opacity: 1,
        display: "block",
        padding: "16px 16px",
        color: "white",
        textDecoration: "none",
    },
    active_link_side: {
        borderLeft: "3px solid white",
        opacity: 1,
        display: "block",
        padding: "16px 16px",
        color: "white",
        textDecoration: "none",
    },
    active_link_bottom: {
        borderBottom: "3px solid white",
        opacity: 1,
    },
}

const SideBarContent = () => {

    const classes = useStyles();
    const history = useHistory();

    const [uploadProgress, setUploadProgress, beginUpload] = useUpload();
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const handleUploadDialogOpen = () => {
        setShowUploadDialog(true);
    }
    const handleUploadDialogClose = () => {
        setShowUploadDialog(false);
    }
    const toggleUploadDialog = () => {
        setShowUploadDialog(!showUploadDialog);
    }

    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const uploadProgressStart = () => {

    }
    const uploadProgressEnd = () => {
        setShowUploadProgress(false);
    }
    const resetProgress = () => {
        resetUploadProgress(setUploadProgress);
    }

    const beginUploadWrapper = (uploadArgs: uploadArgs) => {
        //@ts-ignore
        beginUpload(uploadArgs, uploadProgressStart);

    }
    const uploadProgressFinish = () => {
        resetProgress();
    }

    //@ts-ignore
    const forceLoad = useSelector(state => state.forceLoad);

    const handleNav = (e: any) => {
        forceLoad.shouldForceLoad ? e.preventDefault() : null;
    };


    const uploadClick = (e: any) => {
        e.preventDefault();
        toggleUploadDialog();
    }



    const {pathname} = useLocation();

    return(
        <SideBarComp>
            <div>


                <UploadDialog
                        showUploadDialog={showUploadDialog}
                        handleUploadDialogClose={handleUploadDialogClose}
                        beginUpload={beginUploadWrapper}
                />

                <div className={classes.content}>

                    <Tooltip
                        title="Upload"
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={uploadClick}
                        >
                            <AddCircleIcon className={showUploadDialog ? classes.btnActive : classes.btnInactive} />
                        </IconButton>
                    </Tooltip>


                    <Divider 
                        style={{background: "white"}}
                        variant="middle"
                    />

                    <Tooltip
                        title="Home"
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={() => {
                                history.push(routes.HOME)
                            }}
                        >

                            <HomeIcon className={pathname === routes.HOME ? classes.btnActive : classes.btnInactive} />

                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title="Editor"
                        placement="right"
                        arrow 
                    >
                        <IconButton
                            onClick={() => {
                                history.push(routes.EDITOR)
                            }}
                        >

                            <EqualizerIcon className={pathname === routes.EDITOR ? classes.btnActive : classes.btnInactive} />
                        </IconButton>
                    </Tooltip>

                </div>

            </div>

        </SideBarComp>
    )

}

export default SideBarContent;