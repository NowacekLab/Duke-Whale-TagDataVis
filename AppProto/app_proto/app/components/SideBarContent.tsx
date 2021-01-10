import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import routes from '../scripts/files/scripts_files/routes.json';
import SideBarComp from "./SideBarComp";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import { Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';

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
});
const styles = {
    sidebarLink: {
        display: "block",
        padding: "16px 16px",
        color: "white",
        textDecoration: "none",
    },
    active_link_side: {
        borderLeft: "3px solid white",
        opacity: 1,
    },
    active_link_bottom: {
        borderBottom: "3px solid white",
        opacity: 1,
    },
}

const SideBarContent = () => {

    const classes = useStyles();

    //@ts-ignore
    const forceLoad = useSelector(state => state.forceLoad);

    const handleNav = (e: any) => {
        forceLoad.shouldForceLoad ? e.preventDefault() : null;
    };
    return(
        <SideBarComp>
            <div>

                <div className={classes.content}>
                    <NavLink to={routes.HOME} exact style={styles.sidebarLink} activeStyle={styles.active_link_side} onClick={handleNav}>
                        <ListItem>
                            <ListItemIcon>
                                <HomeIcon style={{color:"white"}} fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText 
                                disableTypography 
                                primary={<Typography className={classes.text}>{"Home"}</Typography>}
                            />                    
                        </ListItem>
                    </NavLink>
                    <NavLink to={routes.APPS} exact style={styles.sidebarLink} activeStyle={styles.active_link_side} onClick={handleNav}>
                        <ListItem>
                            <ListItemIcon>
                                <AppsIcon style={{color:"white"}} fontSize="large"/>
                            </ListItemIcon>
                            <ListItemText 
                                disableTypography 
                                primary={<Typography className={classes.text}>{"Apps"}</Typography>}
                            />
                        </ListItem>

                    </NavLink>

                </div>

                <div className={classes.bottomBtnCont}>
                    <NavLink to={routes.SETTINGS} exact activeStyle={styles.active_link_bottom} onClick={handleNav}>
                        <IconButton>
                            <SettingsIcon style={{color: "white"}} fontSize="large" />
                        </IconButton>
                    </NavLink>
                    <NavLink to={routes.INFO} exact activeStyle={styles.active_link_bottom} onClick={handleNav}>
                        <IconButton>
                            <HelpIcon style={{color: "white"}} fontSize="large" />
                        </IconButton>
                    </NavLink>
                </div>


            </div>

        </SideBarComp>
    )

}

export default SideBarContent;