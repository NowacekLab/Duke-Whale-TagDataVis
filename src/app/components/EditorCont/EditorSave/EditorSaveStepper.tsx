import React, {useState, useEffect} from 'react'; 
import {useDispatch} from "react-redux";
import GenericStepper from '../../GenericStepper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SelectBatchBtn from '../../SelectBatchBtn';
import {notifsActionsHandler} from '../../../functions/reduxHandlers/handlers';
import EditorGraphName from './EditorGraphName';
import {getSaveDirPath} from '../../../functions/paths';
import {pathGivenDir} from '../../../functions/files';

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

interface EditorSaveStepperProps {
  onSave: any,
};

export default function EditorSaveStepper(props: EditorSaveStepperProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Export HTML");

  const steps = ['Select a batch', 'Save graph'];

  const getStepLabel = (idx: number) => {
    return steps[idx];
  }
  const getStepTextContent = (idx: number) => {
    return null;
  }

  const [batchName, setBatchName] = useState("");
  const onBatchSelect = (batchName: string) => {
    setBatchName(batchName);
  }


  const saveDirPath = getSaveDirPath();
  const [batchDir, setBatchDir] = useState(saveDirPath);

  useEffect(() => {
    setBatchDir(pathGivenDir(saveDirPath, batchName));
  }, [batchName])

  const [fileName, setFileName] = useState("");
  const [fileNameError, setFileNameError] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [fileExistCheck, setFileExistCheck] = useState(false);

  const onFileNameChange = (e: any) => {
    setFileName(e?.target?.value ?? "");
  }

  const onFileNameErrorChange = (error: boolean) => {
    setFileNameError(error);
  }

  const onFileExistsChange = (exists: boolean) => {
    setFileExist(exists);
  }

  const onFileExistCheckChange = (checked: boolean) => {
    setFileExistCheck(checked);
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
          <EditorGraphName
            onFileNameChange = {onFileNameChange}
            fileName = {fileName}
            onFileNameErrorChange= {onFileNameErrorChange}
            fileNameError= {fileNameError}
            fileExistCheck={fileExistCheck}
            onFileExistCheckChange={onFileExistCheckChange}
            fileExists={fileExist}
            onFileExistsChange={onFileExistsChange}
            batchDir={batchDir}
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
        return batchName === "";
      case 1:
        return (fileNameError || !fileExistCheck || fileExist);
      default:
        return true;
    }
  }

  async function handleActionStart() {
    props.onSave(batchDir, batchName, fileName);
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