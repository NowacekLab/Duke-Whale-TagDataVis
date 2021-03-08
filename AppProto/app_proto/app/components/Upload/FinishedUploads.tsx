import React, {useState} from "react"; 
import {makeStyles} from "@material-ui/core/styles";
import {uploadsActionsHandler, notifsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {useDispatch, useSelector} from "react-redux";
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import WrapWithModal from "../WrapWithModal";
import InfoIcon from '@material-ui/icons/Info';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography"; 
import Paper from "@material-ui/core/Paper";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import WrapWithDialog from '../WrapWithDialog';

const useStyles = makeStyles({
    root: {
        height: "100%",
        width: "100%"
    },
    list: { 
        width: "100%", 
        height: "80%",
        overflow: "auto"
    },
    batchInfoText: {
        primary: {
            color: "white"
        },
        secondary: {
            color: "white"
        }
    }
})

export default function FinishedUploads() {

    const classes = useStyles();

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);

    const notifHandler = new notifsActionsHandler(dispatch);

    const [infoOpen, setInfoOpen] = useState(false);
    const handleInfoToggle = () => {
        setInfoOpen(!infoOpen);
    }
    const handleCloseInfo = () => {
        setInfoOpen(false);
    }

    const [tempBatchName, setTempBatchName] = useState("");
    const [currBatchInfo, setCurrBatchInfo] = useState([]);
    const handleCurrUploadInfoArr = (batchName: string, uploadInfoArr: any) => {
        setTempBatchName(batchName);
        setCurrBatchInfo(uploadInfoArr);
        handleInfoToggle();
    }

    async function removeFinishedUpload (batchName: string) {
        const delRes = await uploadProgHandler.deleteFinishedUpload(batchName);
        if (delRes.success) {
            notifHandler.showSuccessNotif(`Successfully deleted batch '${batchName}'`);
            uploadProgHandler.refreshAllUploads();
        } else {
            notifHandler.showErrorNotif(`Failed to delete batch '${batchName}'`);
        }
    }

    return (
        <div
            className={classes.root}
        >

            <List
                className={classes.list}
            >
                {
                    Object.keys(uploadsFinished) ? 
                    Object.keys(uploadsFinished).map((batchName) => {
                         //@ts-ignore
                        const uploadProgObj = uploadsFinished[batchName];
                        const uploadInfoArr = uploadProgObj ? uploadProgObj["uploadInfoArr"] : [];
 
                        return (
                            <>
                                <ListItem
                                    button
                                    onClick={() => {handleCurrUploadInfoArr(batchName, uploadInfoArr)}}
                                    key={batchName}
                                >
                                    <ListItemText
                                        primary={batchName}
                                    />

                                    <ListItemSecondaryAction>
                                        <IconButton 
                                            edge = "end"
                                            onClick={() => {removeFinishedUpload(batchName)}}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>

                                </ListItem>

                            </>
                        )

                    })  
                    :
                    null
                    
                }

                <WrapWithDialog
                    showModal={infoOpen}
                    handleClose={handleCloseInfo}
                    handleBack={() => setInfoOpen(false)}
                    title={tempBatchName}
                >
                    <List>
                            {
                                currBatchInfo.map((batchInfoObj: Record<string, string>) => {
                                    const title = batchInfoObj["title"];
                                    const info = batchInfoObj["info"];

                                    return (

                                        <ListItem
                                            key={title}
                                        >
                                            
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography
                                                        style={{
                                                            color: "black",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        style={{
                                                            color: "black"
                                                        }}
                                                    >
                                                        {info}
                                                    </Typography>
                                                }
                                            >

                                            </ListItemText>


                                        </ListItem>

                                    )
                                })
                            }
                    </List>

                </WrapWithDialog>

            </List>
        </div>
    )
}