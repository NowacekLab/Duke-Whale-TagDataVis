import React, {useEffect} from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";

type WrapWithModalProps = {
    showModal: boolean, 
    handleClose: any, // callback
    children: any,
    style?: any,
}

export default function WrapWithModal({showModal, handleClose, children, style}: WrapWithModalProps) {

    useEffect(() => {
    
    }, [showModal])

    return (

        <Modal
            className="modal flex-col-center"
            style={
                {...style, left: "50px", outline:"none"}
            } 
            open={showModal}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500, 
                style: {
                    position: "fixed",
                    left: 50
                }
            }}
            disableBackdropClick
            disableEscapeKeyDown 
        >   
            <Fade in={showModal}>
                {children}
            </Fade>
        </Modal>
    )
}