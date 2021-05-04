import React, {useState} from 'react'; 
import {useDispatch} from "react-redux";
import GenericStepper from '../GenericStepper';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SelectBatchBtn from '../SelectBatchBtn';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import SelectAction from '../SelectAction';
import SelectGraphBtn from '../SelectGraphBtn';

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
  onExportStart: any,
};

export default function ExportHTMLStepper(props: exportHTMLProps) {

  const classes = useStyles();
  const dispatch = useDispatch();

  const notifActionHandler = new notifsActionsHandler(dispatch, "Export HTML");

  const steps = ['Select a batch', 'Select a graph', 'Export'];

  const getStepLabel = (idx: number) => {
    return steps[idx];
  }
  const getStepTextContent = (idx: number) => {
    return null;
  }
  const [action, setAction] = useState("export");
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

  const [graphName, setGraphName] = useState("");
  const [graphPath, setGraphPath] = useState("");
  const onGraphSelect = (graphName: string, graphPath: string) => {
    setGraphName(graphName);
    setGraphPath(graphPath);
  }

  const [fileExistCheck, setFileExistCheck] = useState(false);
  const onFileExistCheckChange = (exists: boolean) => {
    setFileExistCheck(exists);
  }
  const [fileExists, setFileExists] = useState(false);
  const onFileExistsChange = (exists: boolean) => {
    setFileExists(exists);
  }

  const [filePath, setFilePath] = useState("");
  const onFilePathChange = (filePath: string) => {
    setFilePath(filePath);
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
      case 2:
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
            exportOnly={true}
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
        if (graphName === "" || graphPath === "") return true;
        return false;
      case 2:
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

    props.onExportStart(graphPath, filePath);

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