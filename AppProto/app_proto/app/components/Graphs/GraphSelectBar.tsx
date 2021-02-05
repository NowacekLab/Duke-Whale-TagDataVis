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
        outline: "none"
    },
    paperTreeCont: {
        outline: "none",
        maxHeight: "40%",
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
    fileInfoArr: any
}

export default function GraphSelectButtons(props: GraphSelectBarProps) {

    const classes = useStyles();

    const [batchName, setBatchName] = useState("");
    const batchBtnVal = batchName === "" ? "No batch chosen" : batchName;

    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showGraphModal, setShowGraphModal] = useState(false);
    const handleBatchModalClose = () => {
        setShowBatchModal(false);
    }
    const handleGraphModalClose = () => {
        setShowGraphModal(false);
    }
    const toggleBatchModal = () => {
        setShowBatchModal(!showBatchModal);
    }
    const toggleGraphModal = () => {
        if (batchName && batchName !== "") {
            setShowGraphModal(!showGraphModal);
        }
    }

    const availGraphs = {} as any;
    // TODO: a lot of this code is copied from uploads.tsx 
    const batchItems = function(){
        const arr = [];

        console.log("FILE INFO ARR");
        console.log(props.fileInfoArr);

        for (let idx in props.fileInfoArr) {
            const fileInfoObj = props.fileInfoArr[idx];

            console.log("FILE INFO OBJ IN ARR");
            console.log(fileInfoObj);

            if (fileInfoObj.hasOwnProperty("uploadInfo")) {
                const uploadInfo = fileInfoObj['uploadInfo'];
                if (uploadInfo.hasOwnProperty("batchInfo")) {
                    const batchInfo = uploadInfo["batchInfo"];
                    const batchItem = {
                        batchName: uploadInfo["batchName"],
                        labels: [
                            `Data File Name: ${batchInfo["dataFileName"]}`,
                            `Log File Name: ${batchInfo['logFileName']}`,
                            `GPS File Name: ${batchInfo['gpsFileName']}`,
                            `Lat (${batchInfo["startLatitude"]}), Long (${batchInfo["startLongitude"]})`
                        ]
                    }
                    arr.push(batchItem);

                    if (fileInfoObj.hasOwnProperty("genGraphs")) {
                        const genGraphs = fileInfoObj['genGraphs'];
                        const genGraphArr = function(){
                            const arr = [];

                            for (let graphName in genGraphs) {
                                const graphPath = genGraphs[graphName];
                                arr.push({
                                    name: graphName,
                                    path: graphPath
                                })
                            }

                            return arr;
                        }();
                        availGraphs[uploadInfo["batchName"] ?? "Undefined"] = genGraphArr;
                    }
                }
            }

        }

        return arr;
    }();
    
    const onBatchNameSelect = (batchName: string) => {
        setBatchName(batchName);
    }

    const availableGraphs = function(){
        console.log("AVAILABLE GRAPHS FUNCTION CALL")
        console.log(availGraphs)

        if (!availGraphs.hasOwnProperty(batchName)) {
            return [];
        }

        return availGraphs[batchName];

    }();


    // TODO: with careful object creation, below two can be combined
    const [chosenGraph, setChosenGraph] = useState("");
    const [chosenGraphPath, setChosenGraphPath] = useState("");
    const onGraphNameSelect = (graphName: string, graphPath: string) => {
        setChosenGraph(graphName);
        setChosenGraphPath(graphPath);
    }   
    const onGraphSelection = () => {
        handleGraphModalClose(); 
        if (chosenGraph === "" || chosenGraphPath === "") return;
        props.onGraphSelect(chosenGraph, chosenGraphPath);
    }

    const graphBtnVal = chosenGraph === "" ? "No graph chosen" : chosenGraph;

    let curr_tree_item_i = 0;

    return (
        <div
            className={classes.root}
        >   
            <Button
                onClick={toggleBatchModal}
                onChange={props.onBatchChoiceChange}
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
                                            onLabelClick={() => onBatchNameSelect(batchItem["batchName"] ?? "")}
                                            className={classes.treeItem}
                                        >
                                            {
                                                batchItem['labels'] ? 
                                                batchItem['labels'].map((label, label_idx) => {
                                                    curr_tree_item_i++;

                                                    return (
                                                        <TreeItem 
                                                            nodeId={`${curr_tree_item_i}`} 
                                                            label={label} 
                                                            onLabelClick={() => onBatchNameSelect(batchItem["batchName"] ?? "")}
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
                        batchName === ""

                        ?

                        undefined

                        :

                        <Button
                            className={classes.btn}
                            onClick={() => handleBatchModalClose()}
                        >
                            {`Select ${batchName}?`}
                        </Button>
                    }

                </div>
            </WrapWithModal>

            <WrapWithModal
                showModal={showGraphModal}
                handleClose={handleGraphModalClose}
            >

                <div
                    style={{
                        outline: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >

                    <Paper
                        elevation={3}
                        style={{
                            outline: "none"
                        }}
                    >
                        <TreeView>
                            {
                                availableGraphs && 
                                availableGraphs.map((availGraph: any) => {
                                    curr_tree_item_i++;

                                    return (

                                        <TreeItem 
                                            nodeId={`${curr_tree_item_i}`}
                                            label={availGraph["name"] ?? "Name not found"}
                                            onLabelClick={() => {onGraphNameSelect(availGraph["name"] ?? "", availGraph["path"] ?? "")}}
                                            className={classes.treeItem}
                                        />

                                    )

                                })
                            }
                        </TreeView>
                    </Paper>

                    {
                        chosenGraph === ""

                        ?

                        null

                        :

                        <Button
                            className={classes.btn}
                            onClick={() => onGraphSelection()}
                        >
                            {`Select ${chosenGraph}?`}
                        </Button>
                    }

                </div>

            </WrapWithModal>

        </div>
    )

}
