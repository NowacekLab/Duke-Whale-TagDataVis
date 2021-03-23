import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {getDukeImgPath} from "../../functions/paths";

const useStyles = makeStyles({
    root: {
        height: "100%",
        backgroundColor: "var(--primary-color)",
        position: "relative",
        width: 50
    },
});

type SideBarCompProps = {
    children: React.ReactNode;
}

const SideBarComp = (props: SideBarCompProps) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <img src={dukeImgPath} className={classes.logo}/> */}
            {props.children}
        </div>
    );
};

export default SideBarComp;
