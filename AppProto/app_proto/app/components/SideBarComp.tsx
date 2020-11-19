import React from 'react';
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

const SideBarComp = props => {
    const rootStyle = styles
    ? {...styles.root, ...props.style}
    : {}

    const isDev = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;
    const img_path = isDev ? path.resolve(path.join(__dirname, 'server', 'duke.png')) : path.resolve(path.join(remote.app.getAppPath(), 'server', 'duke.png'));

    return (
        <div style={rootStyle}>
            <img src={img_path} style={styles.logo}/>
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
