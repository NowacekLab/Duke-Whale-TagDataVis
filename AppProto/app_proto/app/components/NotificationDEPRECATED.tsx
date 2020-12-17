import React, { useEffect } from "react"; 
import {makeStyles} from '@material-ui/core/styles';
import Alert from "@material-ui/lab/Alert";
import Fade from "@material-ui/core/Fade";
import useIsMountedRef from "../functions/useIsMountedRef";

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

type NotificationProps = {
    setShow: Function, 
    show: boolean, 
    message: string,
    status: string,
}
const Notification = ({setShow, show, message, status}: NotificationProps) => {

    const classes = useStyles();

    const handleShow = () => {
        setTimeout(() => { // there was a memory leak here that this fixed (I hope)
            if (isMountedRef.current) {
                setShow ? setShow(false) : null;
            }
        }, 3000)
    }

    const isMountedRef = useIsMountedRef();

    useEffect(() => { // this might unnecessarily re-render multiple times 
        if (isMountedRef.current) {
            handleShow();
        }
    }, [show])
    
    const getMessage = () => {
        if (status === 'error') {
            return message ?? "An error has occurred."
        } else if (status === 'success') {
            return message ?? "Successfully executed."
        }
        return "Fatal Error";
    }

    return (
        <div className={classes.bannerSuperCont}>
            {
                show && 
                <div className={classes.bannerCont}>
                    {
                        status === "error" &&
                        <Fade in={status==="error"} timeout={500}>
                            <Alert variant="filled" severity="error" className={classes.banner}> 
                                {getMessage()}
                            </Alert>
                        </Fade>
                    }
                    {
                        status === "success" &&
                        <Fade in={status==="success"} timeout={500}>
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