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
import SelectAction from '../SelectAction';
import SelectBatchBtn from '../SelectBatchBtn';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import UploadBtn from '../UploadBtn';

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

interface AcousticsStepperProps {
  onAcousticsStart: any,
}

export default function AcousticsStepper(props: AcousticsStepperProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Acoustics");

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
    setFileObj(fileObj);
  }

  interface UploadFileObj {
    name: string,
    path: string,
  }

  const [uploadFileObj, setUploadFileObj] = useState<UploadFileObj>({
    "name": "",
    "path": "",
  })

  const onUploadFileObjChange = (uploadFileObj: any) => {
    setUploadFileObj(uploadFileObj);
  }

  const [exportFileName, setExportFileName] = useState("");
  const [exportFileNameError, setExportFileNameError] = useState(false);
  const onExportFileNameChange = (e: any) => {
    setExportFileName(e.target.value ?? "");
  }
  const onExportFileErrorChange = (error: boolean) => {
    setExportFileNameError(error);
  } 

  const [fileExists, setFileExists] = useState(false);
  const onFileExistsChange = (exists: boolean) => {
    setFileExists(exists);
  }
  const [fileExistCheck, setFileExistCheck] = useState(false);
  const onFileExistCheckChange = (exists: boolean) => {
    setFileExistCheck(exists);
  }
  const [filePath, setFilePath] = useState("");
  const onFilePathChange = (filePath: string) => {
    setFilePath(filePath);
  }

  const getStepContent = (idx: number) => {
    switch (idx) {
      case 0:
        return (<UploadBtn 
          onUploadFileObjChange={onUploadFileObjChange}
        />)
      case 1:
        return (<SelectAction 
                  action = {action}
                  onActionChange={onActionSelect}
                  fileObj={fileObj}
                  onFileChange={onFileChange}
                  onFileNameChange={onExportFileNameChange}
                  fileNameExt={".gif"}
                  fileName={exportFileName}
                  onFileNameErrorChange={onExportFileErrorChange}
                  fileNameError={exportFileNameError}
                  exportLabel={"Export GIF"}
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
        if (uploadFileObj['name'] === "" || uploadFileObj['path'] === "") return true;
        return false;
      case 1:
        const exportInvalid = (action === "export" && (!fileObj || !fileObj['path'] || fileObj['path'] === ""));
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
    if (!uploadFileObj['path'] || uploadFileObj['path'] === "") {
      notifActionHandler.showErrorNotif("Valid path not given or found for uploaded file.");
      return;
    }

    const isExport = action === "export";
    
    props.onAcousticsStart(uploadFileObj['path'], filePath, isExport);
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