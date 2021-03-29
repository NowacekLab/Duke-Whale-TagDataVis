import React, {useState} from 'react'; 
import {useDispatch} from "react-redux";
import GenericStepper from '../../GenericStepper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SelectBatchBtn from '../../SelectBatchBtn';
import {notifsActionsHandler} from '../../../functions/reduxHandlers/handlers';
import SelectGraphBtn from '../../SelectGraphBtn';

const useStyles = makeStyles({
  actionSelectDropdown: {
    minWidth: 200,
  },
  containedBtn: {
    marginLeft: "2px",
    marginRight: "2px",
    fontSize: "12px",
    backgroundColor: "#012069",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(1,32,105,0.5)"
    }
  },
});

interface exportHTMLProps {
  onDataLoad: any,
};

export default function ExportHTMLStepper(props: exportHTMLProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Editor");

  const steps = ['Select a batch', 'Select a graph'];

  const getStepLabel = (idx: number) => {
    return steps[idx];
  }
  const getStepTextContent = (idx: number) => {
    return null;
  }
  const [batchName, setBatchName] = useState("");
  const onBatchSelect = (batchName: string, calcFilePath: string) => {
    setBatchName(batchName);
  }

  const [graphName, setGraphName] = useState("");
  const [graphPath, setGraphPath] = useState("");
  const onGraphSelect = (graphName: string, graphPath: string) => {
    setGraphName(graphName);
    setGraphPath(graphPath);
  }

  const getStepContent = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <SelectBatchBtn 
            key={"Select Batch"}
            batchName={batchName}
            onBatchSelect={onBatchSelect}
          />
        )
      case 1:
        return (
          <SelectGraphBtn 
            key = {"Select Graph"}
            batchName={batchName}
            onToggleError={(error: string) => notifActionHandler.showErrorNotif(error)}
            graphName={graphName}
            graphPath={graphPath}
            onGraphSelect={onGraphSelect}
          />
        )
      default:
        return null;
    }
  }

  function handleBackBtnDisabled(steps: Array<any>, idx: number): boolean {
    return idx === 0;
  }
  function handleNextBtnDisabled(steps: Array<any>, idx: number): boolean {
    switch (idx) {
      case 0:
        if (batchName === "") return true;
        return false;
      case 1:
        if (graphName === "" || graphPath === "") return true;
        return false;
      default:
        return true;
    }
  }

  async function handleActionStart() {
    props.onDataLoad(graphPath);
  }

  const getFinalBtns = () => {
    return (
        <Button 
            onClick={handleActionStart}
            variant="contained"
            className={classes.containedBtn}
        >
            Execute 
        </Button>
    )
  }

  return (

    <GenericStepper 
      steps={steps}
      getStepLabel={getStepLabel}
      getStepTextContent={getStepTextContent}
      getStepContent={getStepContent}
      handleBackBtnDisabled={handleBackBtnDisabled}
      handleNextBtnDisabled={handleNextBtnDisabled}
      getFinalBtns={getFinalBtns}
    />

  )

}