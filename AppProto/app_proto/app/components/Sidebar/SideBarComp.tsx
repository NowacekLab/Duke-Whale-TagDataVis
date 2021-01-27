import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {getDukeImgPath} from "../../functions/paths";

const useStyles = makeStyles({
    root: {
        fontFamily: "HelveticaNeue-Light",
        fontWeight: 300,
        height: "100%",
        backgroundColor: "#012069",
        position: "relative",
        width: 50
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

    const dukeImgPath = getDukeImgPath();

    return (
        <div className={classes.root}>
            {/* <img src={dukeImgPath} className={classes.logo}/> */}
            {props.children}
        </div>
    );
};

export default SideBarComp;
