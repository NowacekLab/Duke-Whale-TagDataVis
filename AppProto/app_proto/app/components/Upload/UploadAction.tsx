import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import UploadDialog from "./UploadDialog";
import {notifsActionsHandler, uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {uploadArgs, uploadInfo} from "../../functions/uploads/uploadsTypes";
import {throwErrIfFail} from "../../functions/responses";

export default function UploadAction() {

    const dispatch = useDispatch();
    const uploadHandler = new uploadsActionsHandler(dispatch);
    const notifHandler = new notifsActionsHandler(dispatch);

    //@ts-ignore
    const uploadState = useSelector(state => state.uploads);

    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const handleUploadDialogOpen = () => {
        setShowUploadDialog(true);
    }
    const handleUploadDialogClose = () => {
        setShowUploadDialog(false);
    }

    async function beginUploadWrapper(uploadArgs: uploadArgs, uploadInfo: uploadInfo) {

        try {
            const newIdx = uploadHandler.nextOpenIdx(uploadState);

            function updateUploadProgress(progStep: string, newProgStepVal: string) {
                uploadHandler.updateUploadProgress(newIdx, progStep, newProgStepVal);
            } 

            try {
                uploadHandler.addNewUploadProgress(uploadInfo, uploadState);
            } catch {
                throw Error("Failed to add new upload `In Progress`.")
            }

            handleUploadDialogClose();
            const uploadResponseObj = await uploadHandler.startUpload(uploadArgs, uploadInfo, updateUploadProgress);
            throwErrIfFail(uploadResponseObj);
            const uploadResponse = uploadResponseObj.response;
            notifHandler.showSuccessNotif(uploadResponse);
        
            try {
                uploadHandler.refreshAllUploads(uploadState);
            } catch {
                throw Error("Failed to refresh `Uploads` view.")
            }

        } catch (error) {
            if (typeof error === "string") {
                notifHandler.showErrorNotif(error);
            } else {
                notifHandler.showErrorNotif("An unexpected error occurred");
            }
        }
            
    }


    useEffect(() => {
        uploadHandler.refreshAllUploads(uploadState);
    }, [])

    return (

        <React.Fragment>

                <UploadDialog
                        showUploadDialog={showUploadDialog}
                        handleUploadDialogClose={handleUploadDialogClose}
                        uploadState={uploadState}
                        beginUpload={beginUploadWrapper}
                />

                <Tooltip
                    title={"Upload"}
                    arrow
                    placement="right-start"
                >
                    <IconButton
                        onClick={handleUploadDialogOpen}
                        style={{
                            color: "white"
                        }}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>

        </React.Fragment>

    )

}