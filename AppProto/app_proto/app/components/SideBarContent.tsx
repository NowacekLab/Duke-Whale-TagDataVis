import React, {ReactNode} from 'react';
import { Link, NavLink } from 'react-router-dom';
import routes from '../constants/routes.json';
import SideBarComp from "./SideBarComp";
import PropTypes from "prop-types";
import {Icon} from "@blueprintjs/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import { Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';

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
};

const SideBarContent = props => {

    return(
        <SideBarComp>
            <div style={styles.content}>
                <NavLink to={routes.HOME} exact style={styles.sidebarLink} activeStyle={styles.active_link_side}>
                    <ListItem>
                        <ListItemIcon>
                            <HomeIcon style={{color:"white"}} fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText 
                            disableTypography 
                            primary={<Typography style={styles.text}>{"Home"}</Typography>}
                        />                    
                    </ListItem>

                    {/* <Icon icon="home" iconSize={25} intent="primary"/>
                    Home */}
                </NavLink>

                {/* <a href="#" style={styles.sidebarLink}>
                    Home
                </a> */}

                <NavLink to={routes.APPS} exact style={styles.sidebarLink} activeStyle={styles.active_link_side}>
                    <ListItem>
                        <ListItemIcon>
                            <AppsIcon style={{color:"white"}} fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText 
                            disableTypography 
                            primary={<Typography style={styles.text}>{"Apps"}</Typography>}
                        />
                    </ListItem>

                </NavLink>

            </div>

            <div style={styles.bottomBtnCont}>
                <NavLink to={routes.SETTINGS} exact activeStyle={styles.active_link_bottom}>
                    <IconButton>
                        <SettingsIcon style={{color: "white"}} fontSize="large" />
                    </IconButton>
                </NavLink>
                <NavLink to={routes.INFO} exact activeStyle={styles.active_link_bottom}>
                    <IconButton>
                        <HelpIcon style={{color: "white"}} fontSize="large" />
                    </IconButton>
                </NavLink>
            </div>

        </SideBarComp>
    )

}

SideBarContent.propTypes = {
    style: PropTypes.object,
};

export default SideBarContent;