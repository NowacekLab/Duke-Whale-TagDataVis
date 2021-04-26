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
import WaveletsSelectVariables from './WaveletsSelectVariables';
import SelectAction from '../SelectAction';
import WaveletsParams from './WaveletsParams';
import {waveletsCMDLineArgs, wavesParams} from '../../functions/exec/process';
import WaveletsShowLevels, {defaultWaveletsLevels, WaveletsLevelsValue} from './WaveletsShowLevels';

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

interface wavesParamErrors {
  [index: string]: boolean,
  depthLimit: boolean,
  colorByVar: boolean,
};

interface WaveletsStepperProps {
  onWaveletsStart: any,
};

export default function WaveletsStepper(props: WaveletsStepperProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const [waveletsLevelsVal, setWaveletsLevelsVal] = useState<WaveletsLevelsValue>(defaultWaveletsLevels);

  const notifActionHandler = new notifsActionsHandler(dispatch, "Wavelets");

  const steps = ['Select a batch', 'Select interest variable', 'Check the parameters', 'Select an action', 'Select another action'];

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
  const chosenBatchVarsRequired = 1;

  const [waveletsParamsObj, setWaveletsParamsObj] = useState<wavesParams>({
    depthLimit: '0',
    colorByVar: false,
  });

  const [wavesParamsErrors, setWaveletsParamsErrors] = useState<wavesParamErrors>({
    depthLimit: false,
    colorByVar: false,
  });

  const onWaveletsParamsChange = (newParamsObj: wavesParams) => {
    setWaveletsParamsObj(newParamsObj);
  };

  const onWaveletsErrorsChange = (newParamsError: wavesParamErrors) => {
    setWaveletsParamsErrors(newParamsError);
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

  const [levelsError, setLevelsError] = useState(false);
  const onLevelsErrorChange = (error: boolean) => {
    setLevelsError(error);
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
          <WaveletsSelectVariables 
            key = {"Wavelets Select Variable"}
            chosenBatchName={batchName}
            onChosenBatchVarsChange={onChosenBatchVarsChange}
            chosenBatchVarLimit={chosenBatchVarsRequired}
            chosenBatchVars={chosenBatchVars}
          />
        )
      case 2:
          return (
            <WaveletsParams
              key = {"Wavelets Params"}
              onParamsChange = {onWaveletsParamsChange}
              onErrorsChange = {onWaveletsErrorsChange}
              waveletsParamsObj={waveletsParamsObj}
              waveletsParamsErrors={wavesParamsErrors}
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
      case 4:
        return (
          <WaveletsShowLevels 
            value={waveletsLevelsVal}
            onInputChange={(waveletsLevelsVal: any) => setWaveletsLevelsVal(waveletsLevelsVal)}
            error={levelsError}
            onErrorChange={onLevelsErrorChange}
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
        if (batchName === "" || calcFilePath === "") return true;
        return false;
      case 1:
        if (chosenBatchVars.length < chosenBatchVarsRequired) return true;
        return false;
      case 2:
        const errorVals = Object.keys(wavesParamsErrors).map(key => wavesParamsErrors[key]) ?? [];
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
      case 4:
        const isExportTwo = waveletsLevelsVal['action'] === 'export'; 

        console.log("Export two");
        console.log(isExportTwo);
        const dirPathTwo = waveletsLevelsVal['dirPath'];

        console.log("DIR PATH TWO");
        console.log(dirPathTwo);
        const exportInvalidTwo =  (isExportTwo && (!dirPathTwo || dirPathTwo === ""));

        console.log("EXPORT INVALID TWO:");
        console.log(exportInvalidTwo);

        console.log("LEVELS ERROR: ");
        console.log(levelsError); 

        console.log(exportInvalidTwo || (isExportTwo && levelsError));
        return exportInvalidTwo || (isExportTwo && levelsError);
      default:
        return true;
    }
  }

  async function handleActionStart() {
    let dirPath = fileObj['path'];
    let dirPathTwo = waveletsLevelsVal['dirPath'];

    if (action === "export" && (!dirPath || dirPath === "") && (!dirPathTwo || dirPathTwo === "")) {
      notifActionHandler.showErrorNotif("Valid directory path not chosen.");
      return;
    }

    if (!calcFilePath || calcFilePath === "") {
      notifActionHandler.showErrorNotif("Valid file path for chosen batch not found.");
      return;
    }

    const isExportOne = action === "export" ? "True" : "False";
    const isExportTwo = waveletsLevelsVal['action'] === 'export' ? "True" : "False";
    const newFilePathOne = filePath;
    const newFilePathTwo = waveletsLevelsVal['newFilePath'];
    const showLevels = waveletsLevelsVal['showLevels'] ? "True" : "False";
    const waveletsObj = {
      ...waveletsParamsObj,
      'colorByVar': waveletsParamsObj['colorByVar'] ? "True" : "False",
    }
    const variable = chosenBatchVars[0];

    props.onWaveletsStart(
      calcFilePath, newFilePathOne, newFilePathTwo,
      isExportOne, isExportTwo,
      variable, showLevels, waveletsObj,
    )
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