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

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        backgroundColor: "#012069",
        color: "white"
    }
})

type EditorBottomNavProps = {
    onBatchSelect: any,
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
            <Button
                onClick={toggleBatchModal}
                className={classes.btn}
            >
                {batchBtnVal}
            </Button>

            <WrapWithModal
                showModal={showBatchModal}
                handleClose={handleBatchModalClose}
            >
                <div>
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

        </div>
    )

}
