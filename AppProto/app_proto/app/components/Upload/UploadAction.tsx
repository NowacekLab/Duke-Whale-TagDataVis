import React, {useState} from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import UploadDialog from "./UploadDialog";
import useUpload, {uploadArgs, resetUploadProgress} from "../../functions/hooks/useUpload";


export default function UploadAction() {

    const [uploadProgress, setUploadProgress, beginUpload] = useUpload();
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const handleUploadDialogOpen = () => {
        setShowUploadDialog(true);
    }
    const handleUploadDialogClose = () => {
        setShowUploadDialog(false);
    }

    const [showUploadProgress, setShowUploadProgress] = useState(false);
    const uploadProgressStart = () => {

    }
    const uploadProgressEnd = () => {
        setShowUploadProgress(false);
    }
    const resetProgress = () => {
        resetUploadProgress(setUploadProgress);
    }

    const beginUploadWrapper = (uploadArgs: uploadArgs) => {
        //@ts-ignore
        beginUpload(uploadArgs, uploadProgressStart);

    }
    const uploadProgressFinish = () => {
        resetProgress();
    }

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
                    >
                        <AddCircleIcon />
                    </IconButton>
                </Tooltip>

        </React.Fragment>

    )

}