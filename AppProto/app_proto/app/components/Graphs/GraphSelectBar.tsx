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
        width: "50%",
        height: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    btn: {
        backgroundColor: "#012069",
        color: "white"
    }
})

type GraphSelectBarProps = {
    chosenBatch: string,
    onBatchChoiceChange: any,
    onGraphSelect: any,
    fileInfoArr: any
}

export default function GraphSelectButtons(props: GraphSelectBarProps) {

    const classes = useStyles();

    const batchBtnVal = props.chosenBatch === "" ? "No batch chosen" : props.chosenBatch;

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
        setShowGraphModal(!showGraphModal);
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
        props.onBatchChoiceChange(batchName);
    }

    const availableGraphs = function(){
        console.log("AVAILABLE GRAPHS FUNCTION CALL")
        console.log(availGraphs)

        if (!availGraphs.hasOwnProperty(props.chosenBatch)) {
            return [];
        }

        return availGraphs[props.chosenBatch];

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
                                        onLabelClick={() => onBatchNameSelect(batchItem["batchName"] ?? "")}
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

                    {
                        props.chosenBatch === ""

                        ?

                        undefined

                        :

                        <Button
                            className={classes.btn}
                            onClick={() => handleBatchModalClose()}
                        >
                            {`Select ${props.chosenBatch}?`}
                        </Button>
                    }
                </div>
            </WrapWithModal>

            <WrapWithModal
                showModal={showGraphModal}
                handleClose={handleGraphModalClose}
            >

                <div>
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
                                    />

                                )

                            })
                        }
                    </TreeView>

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
