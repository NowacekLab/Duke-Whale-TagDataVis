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
        justifyContent: "center"
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
        overflow: "auto",
        maxHeight: "100%",
        width: "100%",
    },
    rangeFieldCont: {
        display: "flex",
        gap: "10px",
        outline: "none",
        padding: "20px"
    },
    btnContainer: {
        display: "flex",
        gap: "10px"
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

type EditorBottomNavProps = {
    onBatchSelect: any,
    onRangeConfirm: any,
}

export default function EditorBottomNav(props: EditorBottomNavProps) {

    const classes = useStyles();


    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);



    const [chosenColPath, setChosenColPath] = useState("");
    const [tempColPath, setTempColPath] = useState("");

    const [tempBatchName, setTempBatchName] = useState("");
    const [chosenBatchName, setChosenBatchName] = useState("");
    const confirmTempBatchName = () => {
        setChosenBatchName(tempBatchName);
        setChosenColPath(tempColPath);
        handleBatchModalClose();
        props.onBatchSelect(tempBatchName, tempColPath);
    }
    const batchBtnVal = chosenBatchName === "" ? "No batch chosen" : chosenBatchName;


    const [currBatchInfo, setCurrBatchInfo] = useState([]);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const handleBatchModalClose = () => {
        setShowBatchModal(false);
    }
    const toggleBatchModal = () => {
        setShowBatchModal(!showBatchModal);
    }

    const [infoOpen, setInfoOpen] = useState(false);
    
    const viewCurrBatchInfo = (batchName: string, colPath: string, uploadInfoArr: any) => {
        setTempBatchName(batchName);
        setTempColPath(colPath);
        setCurrBatchInfo(uploadInfoArr);
        setInfoOpen(true);
    }



    const [inputMinRange, setInputMinRange] = useState("0");
    const [inputMaxRange, setInputMaxRange] = useState("100");
    const [rangeConfirmed, setRangeConfirmed] = useState(false);
    const onInputMinRange = (event: any) => {
        const newInputMin = event && event.target && event.target.value ? event.target.value : "";
        setInputMinRange(newInputMin);
    }
    const onInputMaxRange = (event: any) => {
        const newInputMax = event && event.target && event.target.value ? event.target.value : "";
        setInputMaxRange(newInputMax);
    }
    const onRangeConfirmation = () => {
        let realMinRange;
        try {
            realMinRange = Number.parseInt(inputMinRange);
        } catch {
            realMinRange = 0;
            setInputMinRange("0");
        }
        let realMaxRange;
        try {
            realMaxRange = Number.parseInt(inputMaxRange);
        } catch {
            realMaxRange = 1;
            setInputMaxRange("100");
        }
        props.onRangeConfirm(realMinRange, realMaxRange);
        handleRangeModalClose();
        setRangeConfirmed(true);
    }


    const [showRangeModal, setShowRangeModal] = useState(false);
    const handleRangeModalClose = () => {
        setShowRangeModal(false);
    }
    const toggleRangeModal = () => {
        setShowRangeModal(!showRangeModal);
    }


    return (
        <div
            className={classes.root}
        >   
            <div
                className={classes.btnContainer}
            >
                <Button
                    onClick={toggleBatchModal}
                    className={classes.btn}
                >
                    {batchBtnVal}
                </Button>

                <Button
                    className={classes.btn}
                    onClick={toggleRangeModal}
                >
                    {rangeConfirmed ? `${inputMinRange} : ${inputMaxRange}` : "Confirm Range"}
                </Button>
            </div>


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

                            <List>
                                {
                                    uploadsFinished && 
                                    Object.keys(uploadsFinished) ?
                                    Object.keys(uploadsFinished).map((batchName) => {
                                        
                                        //@ts-ignore
                                        const uploadProgObj = uploadsFinished[batchName];
                                        const uploadInfoArr = uploadProgObj ? uploadProgObj["uploadInfoArr"] : [];
                                        const colPath = uploadProgObj["cols"] && uploadProgObj["cols"]["cols.json"] ? uploadProgObj["cols"]["cols.json"] : "";
                
                                        return (
                                            <>
                
                                                <ListItem
                                                    button
                                                    onClick={() => {viewCurrBatchInfo(batchName, colPath, uploadInfoArr)}}
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

                            </List>
                        }
                    </Paper>


                </div>
            </WrapWithModal>

            <WrapWithModal
                showModal={showRangeModal}
                handleClose={handleRangeModalClose}
            >
                <div
                    className={classes.paperWrapper}
                >
                    <Paper
                        elevation={3}
                        className={classes.rangeFieldCont}
                    >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                }}
                            >   
                                {
                                    Number.isInteger(Number.parseInt(inputMinRange)) &&
                                    Number.parseInt(inputMinRange) >= 0 

                                    ?

                                    <TextField 
                                        label="Minimum"
                                        value={inputMinRange}
                                        onChange={onInputMinRange}
                                    />

                                    :

                                    <TextField
                                        error
                                        value={inputMinRange}
                                        label="Error Minimum"
                                        helperText="Must be an integer > 0"
                                        onChange={onInputMinRange}
                                    />

                                }

                                {
                                    Number.isInteger(Number.parseInt(inputMaxRange)) 

                                    ?

                                    <TextField 
                                        label="Maximum"
                                        value={inputMaxRange}
                                        onChange={onInputMaxRange}
                                    />

                                    :

                                    <TextField 
                                        error
                                        value={inputMaxRange}
                                        onChange={onInputMaxRange}
                                        label="Error Maximum"
                                        helperText="Must be an integer"
                                    />

                                }
                            </div>

                    </Paper>

                    {
                        Number.isInteger(Number.parseInt(inputMinRange)) &&
                        Number.parseInt(inputMinRange) >= 0 &&
                        Number.isInteger(Number.parseInt(inputMaxRange)) &&

                        <Button
                            className={classes.btn}
                            onClick={() => onRangeConfirmation()}
                        >
                            {`Confirm Range?`}
                        </Button>
                    }
                </div>


            </WrapWithModal>

        </div>
    )

}
