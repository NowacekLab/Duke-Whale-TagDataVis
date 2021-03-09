import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import SideBarContent from "../components/Sidebar/SideBarContent";
import Sidebar from "react-sidebar";
import Notification from "../components/Notification";
import Fab from '@material-ui/core/Fab';
import NotificationsIcon from '@material-ui/icons/Notifications';


const useStyles = makeStyles({
    btn: {
        backgroundColor: "#012069",
        color: "white",
        "&:hover": {
            backgroundColor: "#012069",
            opacity: 0.8
        }
    }
});

type Props = {
    Page: any;
};

export default function Base({Page}: Props) {

    const classes = useStyles();

    return ( 
        <Sidebar
            sidebar={<SideBarContent />}
            docked={true}
        >
            <Page />

            <Notification />

            <Fab size="small" style={{
                position: "absolute",
                right: 10,
                bottom: 10,
            }} className={classes.btn}>
                <div style={{
                    position: "relative",

                }}>
                    <NotificationsIcon />

                    <div
                        style={{
                            borderRadius: "50%",
                            position: "absolute",
                            top: 1,
                            right: 1,
                            color: "red",
                            backgroundColor: "red",
                            height: "5px",
                            width: "5px"
                        }}
                    />

                </div>
            </Fab>

        </Sidebar>
    )
}
