import React from "react";
import WrapWithModal from "../WrapWithModal";
import UploadStepper from "./UploadStepper";

type UploadDialogContProps = {
    showUploadDialog: boolean, 
    handleUploadDialogClose: any, // Callback}
    beginUpload: any, //Callback
}

export default function UploadDialogCont(props: UploadDialogContProps) {

    return (

        <WrapWithModal
            showModal={props.showUploadDialog}
            handleClose={props.handleUploadDialogClose}
        >
            <UploadStepper 
                beginUpload={props.beginUpload}
            />
        </WrapWithModal>

    )

}