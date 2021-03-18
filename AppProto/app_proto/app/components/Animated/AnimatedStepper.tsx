import React, {useState, useRef} from 'react'; 
import {useDispatch} from "react-redux";
import SelectBatchDialog from '../SelectBatchDialog';
import GenericStepper from '../GenericStepper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AnimateSelectAction from './AnimateSelectAction';
import SelectBatchBtn from '../SelectBatchBtn';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';

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
})

interface AnimatedStepperProps {
  onAnimateStart: any,
}

export default function AnimatedStepper(props: AnimatedStepperProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Animate");

  const steps = ['Select a batch', 'Select an action'];
  const getStepLabel = (idx: number) => {
    return steps[idx];
  }
  const getStepTextContent = (idx: number) => {
    return null;
  }
  const [action, setAction] = useState("temp");
  function onActionSelect(val: string) {
    setAction(val);
  }
  const [fileObj, setFileObj] = useState({
    "path": "",
  })
  function onFileChange(fileObj: any) {
    console.log("On File Change");
    console.log(fileObj);
    setFileObj(fileObj);
  }
  const [batchName, setBatchName] = useState("");
  const [calcFilePath, setCalcFilePath] = useState("");
  const onBatchSelect = (batchName: string, calcFilePath: string) => {
    setBatchName(batchName);
    setCalcFilePath(calcFilePath);
  }
  const getStepContent = (idx: number) => {
    switch (idx) {
      case 0:
        return (<SelectBatchBtn 
                  batchName={batchName}
                  onBatchSelect={onBatchSelect}
              />)
      case 1:
        return (<AnimateSelectAction 
                  action = {action}
                  onActionChange={onActionSelect}
                  fileObj={fileObj}
                  onFileChange={onFileChange}
                />)
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
        if (batchName === "" || calcFilePath === "") return true;
        return false;
      case 1:
        if (action === "export" && (!fileObj || !fileObj['path'] || fileObj['path'] === "")) return true;
        return false; 
      default:
        return true;
    }
  }

  async function handleActionStart() {
    let dirPath = fileObj['path'];

    console.log("Handle Action Start");
    console.log("File Object");
    console.log(fileObj);
    if (action === "export" && (!dirPath || dirPath === "")) {
      notifActionHandler.showErrorNotif("Valid directory path not chosen.");
      return;
    }

    console.log("Calc File Path");
    console.log(calcFilePath);
    if (!calcFilePath || calcFilePath === "") {
      notifActionHandler.showErrorNotif("Valid file path for chosen batch not found.");
      return;
    }

    const isExport = action === "export";
    
    props.onAnimateStart(calcFilePath, dirPath, isExport);
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