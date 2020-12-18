import React, { useEffect } from "react"; 
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Alert from "@material-ui/lab/Alert";
import Fade from "@material-ui/core/Fade";
import useIsMountedRef from "../functions/useIsMountedRef";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";

const useStyles = makeStyles({
    banner: {
        boxShadow: "5px 10px",
        marginTop: "10px",
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
    bannerCont: {
        width: "500px",
        alignItems: "center",
        justifyContent: "center",
        animation: "all 1s ease-in",
    },
});

const Notification = () => {

    const classes = useStyles();

    const dispatch = useDispatch();
    const notifActionHandler = new notifsActionsHandler(dispatch);

    //@ts-ignore
    const notif = useSelector(state => state.notif);

    const handleHideNotification = () => {
        setTimeout(() => { // there was a memory leak here that this fixed (I hope)
            if (isMountedRef.current) {
                notifActionHandler.hideNotification();
            }
        }, 3000)
    }

    const isMountedRef = useIsMountedRef();

    useEffect(() => { // this might unnecessarily re-render multiple times 
        if (notif.visibility && isMountedRef.current) {
            handleHideNotification();
        }
    }, [notif.visibility])
    
    const getMessage = () => {
        if (notif.status === 'error') {
            return notif.msg ?? "An error has occurred."
        } else if (notif.status === 'success') {
            return notif.msg ?? "Successfully executed."
        }
        return "Fatal Error";
    }

    return (
        <div className={classes.bannerSuperCont}>
            {
                notif.visibility && 
                <div className={classes.bannerCont}>
                    {
                        notif.status === "error" &&
                        <Fade in={notif.status==="error"} timeout={500}>
                            <Alert variant="filled" severity="error" className={classes.banner}> 
                                {getMessage()}
                            </Alert>
                        </Fade>
                    }
                    {
                        notif.status === "success" &&
                        <Fade in={notif.status==="success"} timeout={500}>
                            <Alert variant="filled" severity="success" className={classes.banner}>
                                {getMessage()}
                            </Alert>
                        </Fade>
                    }
                </div>
            }
        </div>
    )

}

export default Notification; 
//Graphs.tsx