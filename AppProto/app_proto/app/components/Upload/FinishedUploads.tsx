import React, {useState} from "react"; 
import {makeStyles} from "@material-ui/core/styles";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
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

const useStyles = makeStyles({
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

    const [infoOpen, setInfoOpen] = useState(false);
    const handleInfoToggle = () => {
        setInfoOpen(!infoOpen);
    }
    const handleCloseInfo = () => {
        setInfoOpen(false);
    }
    const removeProgress = (idx: number) => {
        uploadProgHandler.removeProgress(idx);
    }

    const [currBatchInfo, setCurrBatchInfo] = useState([]);
    const handleCurrBatchInfo = (batchInfo: any) => {
        setCurrBatchInfo(batchInfo);
        handleInfoToggle();
    }

    return (
        <div>

            <List

            >
                {
                    uploadsFinished.map((uploadFinished) => {

                        const uploadInfo = uploadProgHandler.getUploadInfo(uploadFinished);
                        const batchName = uploadInfo["batchName"];
                        const batchInfo = uploadInfo["batchInfo"];
                        const idx = uploadFinished["index"];
                        
                        return (
                            <>
                                <ListItem button onClick={() => {handleCurrBatchInfo(batchInfo)}}>

                                    <ListItemText 
                                        primary={batchName}
                                    />

                                    {/* <ListItemSecondaryAction>
                                        <IconButton 
                                            onClick={() => removeProgress(idx)}
                                        >
                                            <CloseIcon style={{marginLeft: "5px", color: "red"}}/> 
                                        </IconButton>
                                    </ListItemSecondaryAction> */}

                                    
                                </ListItem>
                            </>
                        )

                    })

                }

                <WrapWithModal
                    showModal={infoOpen}
                    handleClose={handleCloseInfo}
                >
                    <List>
                            {
                                currBatchInfo.map((batchInfoObj: Record<string, string>) => {
                                    const title = batchInfoObj["title"];
                                    const info = batchInfoObj["info"];

                                    return (

                                        <ListItem>
                                            
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography
                                                        style={{
                                                            color: "white",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography
                                                        style={{
                                                            color: "white"
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
                </WrapWithModal>

            </List>
        </div>
    )
}

{/* <p style={{fontSize: "18px", margin:0, padding:0}}>{item['title']}</p>
{
    item['show'] === 'success' && 
    <Fade in={item['show'] === 'success'} timeout={500}>
        <DoneIcon style={{marginLeft: "5px", color: "green"}}/> 
    </Fade>
}
{
    item['show'] === 'progress' && 
    <CircularProgress style={{width: "15px", height: "15px", marginLeft: "5px", color: "white"}} />
}
{
    item['show'] === 'fail' &&
    <Fade in={item['show'] === 'fail'} timeout={500}>
        <CloseIcon style={{marginLeft: "5px", color: "red"}}/> 
    </Fade>
}
</div> */}