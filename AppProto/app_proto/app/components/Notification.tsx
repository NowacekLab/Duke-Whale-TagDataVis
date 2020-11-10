import React, { useState, useEffect } from "react"; 

import Alert from "@material-ui/lab/Alert";
import Fade from "@material-ui/core/Fade";

const styles = {
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
}

const Notification = props => {

    const handleShow = () => {
        setTimeout(() => {
            props.setShow ? props.setShow(false) : null;
        }, 3000)
    }

    useEffect(() => { // this might unnecessarily re-render multiple times 
        handleShow();
    }, [props.show])

    const status = props.status ? props.status : "error";
    
    const getMessage = () => {
        if (status === 'error') {
            return props.message ? props.message : "An error has occurred."
        } else if (status === 'success') {
            return props.message ? props.message : "Successfully executed."
        }
    }

    const show = props.show ? props.show : false;

    // Below, severity={...} has been tried, does not work, seems to only accept string

    return (
        <div style={styles.bannerSuperCont}>
            {
                show && 
                <div style={styles.bannerCont}>
                    {
                        status === "error" &&
                        <Fade in={status==="error"} timeout={500}>
                            <Alert variant="filled" severity="error" style={styles.banner}> 
                                {getMessage()}
                            </Alert>
                        </Fade>
                    }
                    {
                        status === "success" &&
                        <Fade in={status==="success"} timeout={500}>
                            <Alert variant="filled" severity="success" style={styles.banner}>
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