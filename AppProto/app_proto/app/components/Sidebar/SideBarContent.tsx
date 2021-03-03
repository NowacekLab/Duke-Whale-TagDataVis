import React, {useState, useEffect} from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import routes from '../../routes.json';
import SideBarComp from "./SideBarComp";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import UploadDialog from "../Upload/UploadDialog";
import Divider from "@material-ui/core/Divider";
import { Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import EqualizerIcon from '@material-ui/icons/Equalizer';
import uploadsActionsHandler from "../../functions/uploads/uploadsActionsHandler";
import UploadAction from "../Upload/UploadAction";
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';

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

    //@ts-ignore
    const forceLoad = useSelector(state => state.forceLoad);

    const introState = useSelector(state => state.intro);
    const userFirstTime = introState['first'];

    const {pathname} = useLocation();

    const isNavEnabled = () => {
        return !userFirstTime;
    }

    const navIfEnabled = (navRoute: string) => {
        const navEnabled = isNavEnabled();
        if (!navEnabled) return;
        history.push(navRoute);
    }

    return(
        <SideBarComp>
            <div>
                <div className={classes.content}>


                    <UploadAction />

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
                                navIfEnabled(routes.HOME)
                            }}
                        >

                            <HomeIcon className={pathname === routes.HOME ? classes.btnActive : classes.btnInactive} />

                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title="Graph View"
                        placement="right"
                        arrow 
                    >
                        <IconButton
                            onClick={() => {
                                navIfEnabled(routes.GRAPHS)
                            }}
                        >
                            <EqualizerIcon className={pathname === routes.GRAPHS ? classes.btnActive : classes.btnInactive} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title="Editor"
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={() => {
                                navIfEnabled(routes.EDITOR)
                            }}
                        >
                            <EditIcon className={pathname === routes.EDITOR ? classes.btnActive : classes.btnInactive} />
                        </IconButton>

                    </Tooltip>

                    <Tooltip
                        title="Export"
                        placement="right"
                        arrow 
                    >

                            <IconButton>
                                <ShareIcon className={pathname === routes.EXPORT ? classes.btnActive : classes.btnInactive}/>
                            </IconButton>

                    </Tooltip>

                    <Tooltip
                        title="Dev Usage"
                        placement="right"
                        arrow
                    >
                        <IconButton
                            onClick={() => {
                                localStorage.removeItem('userFirstTime');
                            }}
                        >
                            <ShareIcon className={classes.btnActive}/>
                        </IconButton>

                    </Tooltip>

                </div>

            </div>

        </SideBarComp>
    )

}

export default SideBarContent;