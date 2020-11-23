import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import path from "path";

const useStyles = makeStyles({
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
});

type SideBarCompProps = {
    children: React.ReactNode;
}

const SideBarComp = (props: SideBarCompProps) => {
    const classes = useStyles();

    const isDev = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;
    const img_path = isDev ? path.resolve(path.join(__dirname, 'server', 'duke.png')) : path.resolve(path.join(remote.app.getAppPath(), 'server', 'duke.png'));

    return (
        <div className={classes.root}>
            <img src={img_path} className={classes.logo}/>
            {props.children}
        </div>
    );
};

export default SideBarComp;
