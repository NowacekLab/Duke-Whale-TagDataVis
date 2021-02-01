import React from "react";
import WrapWithModal from "../WrapWithModal";
import UploadStepper from "./UploadStepper";

type UploadDialogContProps = {
    showUploadDialog: boolean, 
    handleUploadDialogClose: any, // Callback}
    uploadState: any,
    beginUpload: any, //Callback
}

export default function UploadDialogCont(props: UploadDialogContProps) {

    return (

        <WrapWithModal
            showModal={props.showUploadDialog}
            handleClose={props.handleUploadDialogClose}
        >
            <UploadStepper 
                uploadState={props.uploadState}
                beginUpload={props.beginUpload}
            />
        </WrapWithModal>

    )

}