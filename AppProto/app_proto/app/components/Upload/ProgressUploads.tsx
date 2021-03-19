import React, {useState} from "react"; 
import {makeStyles} from "@material-ui/core/styles";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {useDispatch, useSelector} from "react-redux";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import WrapWithDialog from "../WrapWithDialog";

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
    listItem: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    }
})

export default function ProgressUploads() {

    const classes = useStyles();

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsProgress = uploadProgHandler.getUploadsProgress(uploadProgState);

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
        setCurrBatchInfo(uploadInfoArr);
        setTempBatchName(batchName);
        handleInfoToggle();
    }

    return (
        <div
            className={classes.root}
        >

            <List
                className={classes.list}
            >
                {

                    Object.keys(uploadsProgress) ? 
                    Object.keys(uploadsProgress).map((batchName) => {
                         //@ts-ignore
                        const uploadProgObj = uploadsProgress[batchName];
                        const uploadInfoArr = uploadProgObj ? uploadProgObj["uploadInfoArr"] : [];

                        console.log("UPLOAD PROGRESS");
                        console.log(batchName);
                        console.log(uploadInfoArr);

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
                    bodyStyle={{
                        minWidth: '500px'
                    }}
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