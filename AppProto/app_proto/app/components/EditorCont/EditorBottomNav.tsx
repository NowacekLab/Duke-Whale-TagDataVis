import React, {useState} from "react";
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
        outline: "none"
    },
    paperTreeCont: {
        outline: "none",
        maxHeight: "40%",
        overflow: "auto"
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
    fileInfoArr: any
}

export default function EditorBottomNav(props: EditorBottomNavProps) {

    const classes = useStyles();

    const [chosenColPath, setChosenColPath] = useState("");
    const [chosenBatch, setChosenBatch] = useState("");
    const batchBtnVal = chosenBatch === "" ? "No batch chosen" : chosenBatch;

    const onBatchNameSelect = (batchName: string, colPath: string) => {
        setChosenBatch(batchName);
        setChosenColPath(colPath);
    }
    const onBatchSelect = () => {
        handleBatchModalClose();
        props.onBatchSelect(chosenBatch, chosenColPath);
    }

    const [showBatchModal, setShowBatchModal] = useState(false);
    const handleBatchModalClose = () => {
        setShowBatchModal(false);
    }
    const toggleBatchModal = () => {
        setShowBatchModal(!showBatchModal);
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


    // TODO: a lot of this code is copied from uploads.tsx 
    const batchItems = function(){
        const arr = [];

        console.log("FILE INFO ARR");
        console.log(props.fileInfoArr);

        for (let idx in props.fileInfoArr) {
            const fileInfoObj = props.fileInfoArr[idx];

            const colObj = fileInfoObj.hasOwnProperty("genCols") ? fileInfoObj['genCols'] : "";
            const colPath = colObj.hasOwnProperty("cols.json") ? colObj['cols.json'] : "";

            console.log("FILE INFO OBJ IN ARR");
            console.log(fileInfoObj);
            console.log(colPath);

            if (fileInfoObj.hasOwnProperty("uploadInfo")) {
                const uploadInfo = fileInfoObj['uploadInfo'];
                if (uploadInfo.hasOwnProperty("batchInfo")) {
                    const batchInfo = uploadInfo["batchInfo"];
                    const batchItem = {
                        batchName: uploadInfo["batchName"],
                        colPath: colPath,
                        labels: [
                            `Data File Name: ${batchInfo["dataFileName"]}`,
                            `Log File Name: ${batchInfo['logFileName']}`,
                            `GPS File Name: ${batchInfo['gpsFileName']}`,
                            `Lat (${batchInfo["startLatitude"]}), Long (${batchInfo["startLongitude"]})`
                        ]
                    }
                    arr.push(batchItem);

                }
            }

        }

        return arr;
    }();


    let curr_tree_item_i = 0;

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
                        <TreeView
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                        >

                            {
                                batchItems.map((batchItem, idx) => {
                                    curr_tree_item_i++;
                                    return ( 
                                        <TreeItem 
                                            nodeId={`${curr_tree_item_i}`} 
                                            label={batchItem["batchName"] ?? "Name not found"}
                                            onLabelClick={() => onBatchNameSelect(batchItem["batchName"] ?? "", batchItem['colPath'] ?? "")}
                                        >
                                            {
                                                batchItem['labels'] ? 
                                                batchItem['labels'].map((label, label_idx) => {
                                                    curr_tree_item_i++;

                                                    return (
                                                        <TreeItem 
                                                            nodeId={`${curr_tree_item_i}`} 
                                                            label={label} 
                                                            onLabelClick={() => onBatchNameSelect(batchItem["batchName"] ?? "", batchItem['colPath'] ?? "")}
                                                        />
                                                    )
                                                })

                                                :

                                                undefined
                                            }
                                        </TreeItem>
                                    )

                                })


                            }
                            
                        </TreeView>
                    </Paper>

                    {
                        chosenBatch === ""

                        ?

                        undefined

                        :

                        <Button
                            className={classes.btn}
                            onClick={() => onBatchSelect()}
                        >
                            {`Select ${chosenBatch}?`}
                        </Button>

                    }
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
