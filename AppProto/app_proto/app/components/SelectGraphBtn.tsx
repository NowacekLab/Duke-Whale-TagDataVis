import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import GraphViewDialog from './Graphs/GraphViewDialog';
import Button from "@material-ui/core/Button";
import {uploadsActionsHandler} from "../functions/reduxHandlers/handlers";

interface SelectGraphBtnProps { 
  batchName: string,
  onToggleError: Function,
  onGraphSelect: Function,
  graphName: string,
  graphPath: string,
  disabled?: boolean,
}

export default function SelectGraphBtn(props: SelectGraphBtnProps) {

  const dispatch = useDispatch();
  //@ts-ignore
  const uploadProgState = useSelector(state => state["uploads"]);
  const uploadProgHandler = new uploadsActionsHandler(dispatch);
  const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);

  const [showGraphModal, setShowGraphModal] = useState(false);
  const handleGraphModalClose = () => {
      setShowGraphModal(false);
  }
  const toggleGraphModal = () => {
      if (props.batchName && props.batchName !== "") {
          setShowGraphModal(!showGraphModal);
      } else {
          props.onToggleError("Must select a batch first.");
      }
  }

  const [availGraphs, setAvailGraphs] = useState({} as any);
  const getAvailGraphs = (batchName: string) => {
       //@ts-ignore
      if (!batchName || batchName === "" || !uploadsFinished.hasOwnProperty(batchName) || !uploadsFinished[batchName]['graphs']) {
          return {}; 
      }
      //@ts-ignore
      setAvailGraphs(uploadsFinished[batchName]['graphs']);
  }

  useEffect(() => {
    getAvailGraphs(props.batchName);
  }, [props.batchName])

  const [graphInfoOpen, setGraphInfoOpen] = useState(false);
  const graphInfoClose = () => {
      setGraphInfoOpen(false);
  }
  const [tempChosenGraph, setTempChosenGraph] = useState("");
  const [tempChosenGraphPath, setTempChosenGraphPath] = useState("");
  const viewCurrGraphInfo = (graphName: string, graphPath: string) => {
      setGraphInfoOpen(true);
      setTempChosenGraph(graphName);
      setTempChosenGraphPath(graphPath);
  }
  const onConfirmChosenGraph = () => { 
      setShowGraphModal(false);
      props.onGraphSelect(tempChosenGraph, tempChosenGraphPath);
  }
  
  const graphBtnVal = props.graphName === "" ? "No graph chosen" : props.graphName;

  const btnDisabled = props.disabled ?? false;

  return (
    <React.Fragment
      key={"Select Graph Btn"}
    >

      <Button
          onClick={toggleGraphModal} 
          id="color-themed"
          className="btn"
          variant="outlined"
          disabled={btnDisabled}
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

    </React.Fragment>
  )

}