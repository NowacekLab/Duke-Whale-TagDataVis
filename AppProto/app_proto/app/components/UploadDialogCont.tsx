import React from "react";
import WrapWithModal from "./WrapWithModal";
import UploadDialogComp from "./UploadDialogComp";

type UploadDialogContProps = {
    showUploadDialog: boolean, 
    beginProcessing: Function, //Callback
    handleUploadDialogClose: any, // Callback
    setUploadInfoObject: Function, 
}

export default function UploadDialogCont(props: UploadDialogContProps) {

    return (

        <WrapWithModal
            showModal={props.showUploadDialog}
            handleClose={props.handleUploadDialogClose}
        >
            <UploadDialogComp 
                setUploadInfoObject={props.setUploadInfoObject}
                beginProcessing={props.beginProcessing}
            />
        </WrapWithModal>

    )

}