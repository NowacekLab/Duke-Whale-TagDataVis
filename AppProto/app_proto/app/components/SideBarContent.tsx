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

const styles = {
    sidebar: {
        width: 200, 
        height: "100%",
    },
    sidebarLink: {
        display: "block",
        padding: "16px 16px",
        color: "white",
        textDecoration: "none",
    },
    active_link: {
        borderLeft: "3px solid white",
        opacity: 1,
    },
    content: {
        height: "100%",
    },
    text: {
        fontFamily: "HelveticaNeue-Light",
        color: "#fff",
    },
};

const SideBarContent = props => {
    const style = props.style 
    ? {...styles.sidebar, ...props.style}
    : styles.sidebar;

    return(
        <SideBarComp title="Duke">
            <div style={styles.content}>
                <NavLink to={routes.HOME} exact style={styles.sidebarLink} activeStyle={styles.active_link}>
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

                <NavLink to={routes.APPS} exact style={styles.sidebarLink} activeStyle={styles.active_link}>
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
        </SideBarComp>
    )

}

SideBarContent.propTypes = {
    style: PropTypes.object,
};

export default SideBarContent;