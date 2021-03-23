import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import Button from "@material-ui/core/Button";
import GraphViewDialog from "./GraphViewDialog";
import SelectBatchDialog from "../SelectBatchDialog";
import {notifsActionsHandler} from "../../functions/reduxHandlers/handlers";

type GraphSelectBarProps = {
    onGraphSelect: any,
}

export default function GraphSelectButtons(props: GraphSelectBarProps) {

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);
    const [currBatchInfo, setCurrBatchInfo] = useState([]);

    const notifActionHandler = new notifsActionsHandler(dispatch, "Graph View");

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
        } else {
            notifActionHandler.showErrorNotif("Must select a batch first.");
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
    const graphInfoClose = () => {
        setGraphInfoOpen(false);
    }
    const [chosenGraph, setChosenGraph] = useState("");
    const [chosenGraphPath, setChosenGraphPath] = useState("");
    const [tempChosenGraph, setTempChosenGraph] = useState("");
    const [tempChosenGraphPath, setTempChosenGraphPath] = useState("");
    const viewCurrGraphInfo = (graphName: string, graphPath: string) => {
        setGraphInfoOpen(true);
        setTempChosenGraph(graphName);
        setTempChosenGraphPath(graphPath);
    }
    const onConfirmChosenGraph = () => { 
        setChosenGraph(tempChosenGraph);
        setChosenGraphPath(tempChosenGraphPath);
        setShowGraphModal(false);
        props.onGraphSelect(tempChosenGraph, tempChosenGraphPath);
    }

    const graphBtnVal = chosenGraph === "" ? "No graph chosen" : chosenGraph;

    return (
        <div
            className = "btnContainer"
        >   
            <Button
                onClick={toggleBatchModal}
                id="color-themed"
                className="btn"
                variant="outlined"
            >
                {batchBtnVal}
            </Button>

            <Button
                onClick={toggleGraphModal} 
                id="color-themed"
                className="btn"
                variant="outlined"
            >
                {graphBtnVal}
            </Button>

            <GraphViewDialog 
                showModal={showGraphModal}
                handleClose={handleGraphModalClose}
                handleBack={handleGraphModalClose}
                displayGraphName={tempChosenGraph}
                confirmDisplayGraphName={onConfirmChosenGraph}
                infoOpen={graphInfoOpen}
                onInfoClose={graphInfoClose}
                viewGraphInfo={viewCurrGraphInfo}
                graphs={availGraphs}
            />

            <SelectBatchDialog 
                showModal={showBatchModal}
                handleClose={handleBatchModalClose}
                handleBack={handleBatchModalClose}
                currBatchInfo={currBatchInfo}
                infoOpen={infoOpen}
                onInfoClose={handleCloseInfo}
                displayBatchName={tempBatchName}
                confirmDisplayBatchName={confirmTempBatchName}
                viewBatchInfo={viewCurrBatchInfo}
                uploads={uploadsFinished}
            />

        </div>
    )

}
