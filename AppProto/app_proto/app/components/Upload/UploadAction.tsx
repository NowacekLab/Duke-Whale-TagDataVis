import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import UploadDialog from "./UploadDialog";
import {notifsActionsHandler, uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {uploadInfo} from "../../functions/uploads/uploadsTypes";
import {throwErrIfFail} from "../../functions/responses";

export default function UploadAction() {

    const dispatch = useDispatch();
    const uploadHandler = new uploadsActionsHandler(dispatch);
    const notifHandler = new notifsActionsHandler(dispatch);

    //@ts-ignore
    const uploadState = useSelector(state => state.uploads);

    //@ts-ignore
    const introState = useSelector(state => state.intro);
    const userFirstTime = introState['first'];

    const [showUploadDialog, setShowUploadDialog] = useState(false);

    const handleUploadDialogOpen = () => {
        setShowUploadDialog(true);
    }
    const handleUploadDialogOpenIfEnabled = () => {
        handleUploadDialogOpen();
    }
    const handleUploadDialogClose = () => {
        setShowUploadDialog(false);
    }

    async function beginUploadWrapper(uploadInfo: uploadInfo) {

        try {
            try {
                uploadHandler.addNewUploadProgress(uploadInfo);
            } catch {
                throw Error("Failed to add new upload `In Progress`.")
            }

            handleUploadDialogClose();
            const uploadResponseObj = await uploadHandler.startUpload(uploadInfo);
            throwErrIfFail(uploadResponseObj);
            const uploadResponse = uploadResponseObj.response;
            uploadHandler.refreshAllUploads();
            notifHandler.showSuccessNotif(uploadResponse);

        } catch (error) {

            uploadHandler.removeNewUploadProgress(uploadInfo);
            uploadHandler.deleteProgressUploadFiles(uploadInfo);
            uploadHandler.refreshAllUploads();
            if (typeof error === "string") {
                notifHandler.showErrorNotif(error);
            } else {
                notifHandler.showErrorNotif("An unexpected error occurred");
            }
        }
            
    }

    useEffect(() => {
        uploadHandler.refreshAllUploads();
    }, [])

    return (

        <React.Fragment>

                <UploadDialog
                        showUploadDialog={showUploadDialog}
                        handleUploadDialogClose={handleUploadDialogClose}
                        beginUpload={beginUploadWrapper}
                />

                <Tooltip
                    title={"Upload"}
                    arrow
                    placement="right-start"
                >
                    <IconButton
                        onClick={handleUploadDialogOpenIfEnabled}
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