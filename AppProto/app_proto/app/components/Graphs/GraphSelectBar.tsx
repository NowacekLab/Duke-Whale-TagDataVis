import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete"; 
import Button from "@material-ui/core/Button";
import WrapWithModal from "../WrapWithModal";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Paper from "@material-ui/core/Paper";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0
    },
    paperWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        outline: "none",
        maxHeight: "80%",
        width: "50%"
    },
    paperTreeCont: {
        outline: "none",
        width: "100%",
    },
    list: {
        width: "100%", 
        height: "50%",
        overflow: "auto"
    },
    treeItem: {
        color: "black"
    },
    btn: {
        backgroundColor: "#012069",
        color: "white",
        "&:hover": {
            backgroundColor: "#012069",
            opacity: 0.8
        }
    }
})

type GraphSelectBarProps = {
    onGraphSelect: any,
}

export default function GraphSelectButtons(props: GraphSelectBarProps) {

    const classes = useStyles();

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);
    const [currBatchInfo, setCurrBatchInfo] = useState([]);


    const viewCurrBatchInfo = (batchName: string, uploadInfoArr: any) => {
        setTempBatchName(batchName);
        setCurrBatchInfo(uploadInfoArr);
        handleInfoToggle();
    }
    const [infoOpen, setInfoOpen] = useState(false);
    const handleInfoToggle = () => {
        setInfoOpen(!infoOpen);
    }
    const handleCloseInfo = () => {
        setInfoOpen(false);
    }

    const [tempBatchName, setTempBatchName] = useState("");
    const confirmTempBatchName = () => {
        onBatchNameSelect(tempBatchName);
        handleBatchModalClose();
    }

    const [batchName, setBatchName] = useState("");
    const batchBtnVal = batchName === "" ? "No batch chosen" : batchName;
    const [showBatchModal, setShowBatchModal] = useState(false);
    const onBatchNameSelect = (batchName: string) => {
        setBatchName(batchName);
        getAvailGraphs(batchName);
    }
    const handleBatchModalClose = () => {
        setShowBatchModal(false);
    }
    const toggleBatchModal = () => {
        setShowBatchModal(!showBatchModal);
    }


    const [showGraphModal, setShowGraphModal] = useState(false);
    const handleGraphModalClose = () => {
        setShowGraphModal(false);
    }
    const toggleGraphModal = () => {
        if (batchName && batchName !== "") {
            setShowGraphModal(!showGraphModal);
        }
    }

    const [availGraphs, setAvailGraphs] = useState({} as any);
    const getAvailGraphs = (batchName: string) => {
         //@ts-ignore
        if (!uploadsFinished.hasOwnProperty(batchName) && !uploadsFinished[batchName]['graphs']) {
            return {}; 
        }
        //@ts-ignore
        setAvailGraphs(uploadsFinished[batchName]['graphs']);
    }


    const [graphInfoOpen, setGraphInfoOpen] = useState(false);
    const handleGraphInfoToggle = () => {
        setGraphInfoOpen(!graphInfoOpen);
    }
    const [chosenGraph, setChosenGraph] = useState("");
    const [chosenGraphPath, setChosenGraphPath] = useState("");
    const [tempChosenGraph, setTempChosenGraph] = useState("");
    const [tempChosenGraphPath, setTempChosenGraphPath] = useState("");
    const onGraphNameSelect = (graphName: string, graphPath: string) => {
        setChosenGraph(graphName);
        setChosenGraphPath(graphPath);
    }   
    
    const viewCurrGraphInfo = (graphName: string, graphPath: string) => {
        setGraphInfoOpen(true);
        setTempChosenGraph(graphName);
        setTempChosenGraphPath(graphPath);
    }
    const onConfirmChosenGraph = () => { 
        setChosenGraph(tempChosenGraph);
        setChosenGraphPath(tempChosenGraphPath);
        props.onGraphSelect(tempChosenGraph, tempChosenGraphPath);
        setShowGraphModal(false);
    }

    const graphBtnVal = chosenGraph === "" ? "No graph chosen" : chosenGraph;

    return (
        <div
            className={classes.root}
        >   
            <Button
                onClick={toggleBatchModal}
                className={classes.btn}
            >
                {batchBtnVal}
            </Button>

            <Button
                onClick={toggleGraphModal}
                className={classes.btn}
            >
                {graphBtnVal}
            </Button>

            <WrapWithModal
                showModal={showBatchModal}
                handleClose={handleBatchModalClose}
            >
                <div
                    className={classes.paperWrapper}
                >
                    <Paper
                        elevation={3}
                        className={classes.paperTreeCont}
                    >   
                        {

                            infoOpen ? 
                    
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                    padding: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setInfoOpen(false)}
                                        style={{
                                            justifySelf: "flex-start",
                                            alignSelf: "center"
                                        }}
                                    >
                                        <ArrowBackIcon 
                                            style={{
                                                color: "black"
                                            }}
                                        />
                                    </IconButton>
                                </div>

                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <h3>
                                        {tempBatchName}
                                    </h3>
                                </div>

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



                                {
                                    tempBatchName === ""

                                    ?

                                    undefined

                                    :

                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Button
                                            className={classes.btn}
                                            onClick={confirmTempBatchName}
                                        >
                                            {`Select`}
                                        </Button>
                                    </div>
                                }

                            </div>

                            :

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
                
                                                <ListItem
                                                    button
                                                    onClick={() => {viewCurrBatchInfo(batchName, uploadInfoArr)}}
                                                    key={batchName}
                                                >
                                                    <ListItemText
                                                        primary={batchName}
                                                    />

                                                </ListItem>
                                        )            

                                    })  

                                    :

                                    null
                                }

                            </List>
                        }
                    </Paper>


                </div>
            </WrapWithModal>




            <WrapWithModal
                showModal={showGraphModal}
                handleClose={handleGraphModalClose}
            >

                <div
                    className={classes.paperWrapper}
                >

                    <Paper
                        elevation={3}
                        className={classes.paperTreeCont}
                    >

                    {

                        
                        graphInfoOpen ? 
                        
                            <div
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                    padding: "10px"
                                }}
                            >
                                <div
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    <IconButton
                                        onClick={() => setGraphInfoOpen(false)}
                                        style={{
                                            justifySelf: "flex-start",
                                            alignSelf: "center"
                                        }}
                                    >
                                        <ArrowBackIcon 
                                            style={{
                                                color: "black"
                                            }}
                                        />
                                    </IconButton>
                                </div>

                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex", 
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <h3>
                                        {tempChosenGraph}
                                    </h3>
                                </div>

                                <List>
                                    {
                                        <ListItem>
                                            
                                            <ListItemText
                                                disableTypography
                                                // primary={
                                                //     <Typography
                                                //         style={{
                                                //             color: "black",
                                                //             fontWeight: "bold"
                                                //         }}
                                                //     >
                                                //         {"Graph Path"}
                                                //     </Typography>
                                                // }
                                                // secondary={
                                                //     <Typography
                                                //         style={{
                                                //             color: "black"
                                                //         }}
                                                //     >
                                                //         {tempChosenGraphPath}
                                                //     </Typography>
                                                // }
                                            >

                                            </ListItemText>


                                        </ListItem>

                                    }
                                </List>

                                {
                                    tempChosenGraph === ""

                                    ?

                                    undefined

                                    :

                                    <div
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Button
                                            className={classes.btn}
                                            onClick={onConfirmChosenGraph}
                                        >
                                            {`Select`}
                                        </Button>
                                    </div>
                                }

                            </div>

                            :

                                <List>
                                    {
                                        Object.keys(availGraphs) ?
                                        Object.keys(availGraphs).map((graphName) => {
                                            
                                            const graphPath = availGraphs[graphName];
                    
                                            return (
                                                <>
                    
                                                    <ListItem
                                                        button
                                                        onClick={() => {viewCurrGraphInfo(graphName, graphPath)}}
                                                        key={graphName}
                                                    >
                                                        <ListItemText
                                                            primary={graphName}
                                                        />

                                                    </ListItem>
                    
                                                </>
                                            )            

                                        })  

                                        :

                                        null
                                    }

                                </List>

                        }
                    </Paper>

                </div>

            </WrapWithModal>

        </div>
    )

}
