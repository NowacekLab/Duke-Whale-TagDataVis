import React from "react";
import WrapWithDialog from "../WrapWithDialog";
import UploadStepper from "./UploadStepper";

type UploadDialogContProps = {
    showUploadDialog: boolean, 
    handleUploadDialogClose: any, // Callback}
    beginUpload: any, //Callback
}

export default function UploadDialogCont(props: UploadDialogContProps) {

    return (

        <WrapWithDialog
            showModal={props.showUploadDialog}
            handleClose={props.handleUploadDialogClose}
            handleBack={props.handleUploadDialogClose}
            title={"Upload"}
            bodyStyle={{
                minWidth: '500px'
            }}
        >
            <UploadStepper 
                beginUpload={props.beginUpload}
            />
        </WrapWithDialog>

    )

}