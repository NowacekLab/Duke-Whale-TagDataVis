import React, {useEffect} from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    modal: {
        position: "absolute",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: "rgba(0,0,0,0.8)"
    },
})

type WrapWithModalProps = {
    showModal: boolean, 
    handleClose: any, // callback
    children: any
}

export default function WrapWithModal({showModal, handleClose, children}: WrapWithModalProps) {

    const classes = useStyles();

    useEffect(() => {
    
    }, [showModal])

    return (

        <Modal
            className={classes.modal}
            style={{left: "200px"}} 
            open={showModal}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500, 
                style: {
                    position: "fixed",
                    left: 200
                }
            }}
        >   
            <Fade in={showModal}>
                {children}
            </Fade>
        </Modal>
    )
}