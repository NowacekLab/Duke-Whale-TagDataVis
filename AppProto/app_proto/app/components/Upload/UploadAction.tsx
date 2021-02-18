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
import {exec} from "child_process";
import {getProdPythonScriptPath} from "../../functions/paths";
import {isWindows} from "../../functions/constants";

export default function UploadAction() {

    const dispatch = useDispatch();
    const uploadHandler = new uploadsActionsHandler(dispatch);
    const notifHandler = new notifsActionsHandler(dispatch);

    useEffect(() => {
        console.log("UPLOAD ACTION");
        const prodPath = getProdPythonScriptPath("process");
        !isWindows && exec(`codesign --remove-signature ${prodPath}`, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
            }
            if (stderr) {
                console.log(stderr);
            }
        })
    }, [])

    //@ts-ignore
    const uploadState = useSelector(state => state.uploads);

    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const handleUploadDialogOpen = () => {
        setShowUploadDialog(true);
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
            notifHandler.showSuccessNotif(uploadResponse);
        
            try {
                uploadHandler.refreshAllUploads();
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