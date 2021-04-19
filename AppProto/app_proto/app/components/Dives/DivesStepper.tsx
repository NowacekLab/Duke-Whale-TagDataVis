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
import SelectBatchBtn from '../SelectBatchBtn';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import DiveSelectVariables from './DivesSelectVariables';
import SelectAction from '../SelectAction';
import DiveParams from './DivesParams';
import {divesParams} from '../../functions/exec/process';

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

interface divesParamErrors {
  [index: string]: boolean,
  minLength: boolean,
  requiredDepth: boolean,
  maxDepth: boolean,
};

interface MahalPOIProps {
  onDivesStart: any,
};

export default function MahalPOI(props: MahalPOIProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Dives");

  const steps = ['Select a batch', 'Select interest variables', 'Check the parameters', 'Select an action'];

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
    setFileObj(fileObj);
  }
  const [exportFileName, setExportFileName] = useState("");
  const [exportFileNameError, setExportFileNameError] = useState(false);
  const onExportFileNameChange = (e: any) => {
    setExportFileName(e.target.value ?? "");
  }
  const onExportFileErrorChange = (error: boolean) => {
    setExportFileNameError(error);
  } 

  const [batchName, setBatchName] = useState("");
  const [calcFilePath, setCalcFilePath] = useState("");
  const onBatchSelect = (batchName: string, calcFilePath: string) => {
    setBatchName(batchName);
    setCalcFilePath(calcFilePath);
  }
  const [chosenBatchVars, setChosenBatchVars] = useState<Array<string>>([]);
  const onChosenBatchVarsChange = (newChosenBatchVars: Array<string>) => {
    setChosenBatchVars(newChosenBatchVars);
  }
  const chosenBatchVarsRequired = 0;

  const [divesParamsObj, setDivesParamsObj] = useState<divesParams>({
    minLength: '60',
    requiredDepth: 'None',
    maxDepth: 'None',
  });

  const [divesParamsErrors, setDivesParamsErrors] = useState<divesParamErrors>({
    minLength: false,
    requiredDepth: false,
    maxDepth: false,
  });

  const onDivesParamsChange = (newParamsObj: divesParams) => {
    setDivesParamsObj(newParamsObj);
  };

  const onDivesErrorsChange = (newParamsError: divesParamErrors) => {
    setDivesParamsErrors(newParamsError);
  };
  const [fileExistCheck, setFileExistCheck] = useState(false);
  const onFileExistCheckChange = (exists: boolean) => {
    setFileExistCheck(exists);
  }
  const [fileExists, setFileExists] = useState(false);
  const onFileExistsChange = (exists: boolean) => {
    setFileExists(exists);
  } 
  const [filePath, setFilePath] = useState("");
  const onFilePathChange = (path: string) => {
    setFilePath(path);
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
          <DiveSelectVariables 
            key = {"Dive Select Vars"}
            chosenBatchName={batchName}
            onChosenBatchVarsChange={onChosenBatchVarsChange}
            chosenBatchVarLimit={chosenBatchVarsRequired}
            chosenBatchVars={chosenBatchVars}
          />
        )
      case 2:
          return (
            <DiveParams
              key = {"Dive Params"}
              onParamsChange = {onDivesParamsChange}
              onErrorsChange = {onDivesErrorsChange}
              divesParamsObj={divesParamsObj}
              divesParamsErrors={divesParamsErrors}
            />
          )
      case 3:
        return (<SelectAction 
          key = {"Select Action"}
          action = {action}
          onActionChange={onActionSelect}
          fileObj={fileObj}
          onFileChange={onFileChange}
          onFileNameChange={onExportFileNameChange}
          fileNameExt={".html"}
          fileName={exportFileName}
          onFileNameErrorChange={onExportFileErrorChange}
          fileNameError={exportFileNameError}
          exportLabel={"Export HTML"}
          fileExistCheck={fileExistCheck}
          onFileExistCheckChange={onFileExistCheckChange}
          filePath={filePath} 
          onFilePathChange={onFilePathChange}
          fileExists={fileExists}
          onFileExistsChange={onFileExistsChange}
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
        if (chosenBatchVars.length < chosenBatchVarsRequired) return true;
        return false;
      case 2:
        const errorVals = Object.keys(divesParamsErrors).map(key => divesParamsErrors[key]) ?? [];
        const paramError = errorVals.reduce((prev: boolean, curr: boolean, currIdx: number, array: Array<boolean>) => {
          return prev && curr;
        });
        return paramError ?? false; 
      case 3:
        const exportInvalid =  (action === "export" && (!fileObj || !fileObj['path'] || fileObj['path'] === ""));
        const exportNameInvalid = (action === "export" && exportFileNameError);
        const fileExistError = (action === "export" && fileExists);
        const fileExistCheckError = (action === "export" && !fileExistCheck);
        return exportInvalid || exportNameInvalid || fileExistError || fileExistCheckError; 
      default:
        return true;
    }
  }

  async function handleActionStart() {
    let dirPath = fileObj['path'];

    if (action === "export" && (!dirPath || dirPath === "")) {
      notifActionHandler.showErrorNotif("Valid directory path not chosen.");
      return;
    }

    if (!calcFilePath || calcFilePath === "") {
      notifActionHandler.showErrorNotif("Valid file path for chosen batch not found.");
      return;
    }

    const isExport = action === "export";

    props.onDivesStart(
      calcFilePath, filePath, isExport, 
      chosenBatchVars, divesParamsObj,
    )

    // props.onMahalPOIStart(calcFilePath, dirPath, isExport, varOne, varTwo, varThree,
    //                       pLimit, windowSize, groupSize, depthLimit);
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