import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import path from "path";

const styles = {
    root: {
        fontFamily: "HelveticaNeue-Light",
        fontWeight: 300,
        position: "relative",
        height: "100%",
    },
    logo: {
        width: "12em",
        height: "6em",
        display: "block",
    }
};

// : path.join(__dirname, '../resources');

const img_path = path.join(__dirname, '../resources/');

const SideBarComp = props => {
    const rootStyle = styles
    ? {...styles.root, ...props.style}
    : {}

    return (
        <div style={rootStyle}>
            <img src={path.join(img_path, "duke.png")} style={styles.logo}/>
            {props.children}
        </div>
    );
};

SideBarComp.propTypes = {
    style: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.object
};

export default SideBarComp;
