import React, {useEffect} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import TextInputWithError from './TextInputWithError';
import {fileNameFromPath} from '../functions/paths';
import {pathExists, pathGivenDir} from '../functions/files';

// @ts-ignore
const {dialog} = require('electron').remote;

const useStyles = makeStyles({
  actionSelectDropdown: {
    minWidth: 200,
  },
})

interface SelectActionProps {
  action: string,
  onActionChange: Function,
  fileObj: any,
  onFileChange: Function,
  onFileNameChange: Function,
  fileNameExt: string, 
  fileName: string,
  onFileNameErrorChange: Function,
  fileNameError: boolean,
  exportLabel: string,
  exportOnly?: boolean,
  fileExistCheck: boolean,
  onFileExistCheckChange: Function,
  filePath: string,
  onFilePathChange: Function,
  fileExists: boolean,
  onFileExistsChange: Function,
}

export default function SelectAction(props: SelectActionProps) {

  const classes = useStyles();

  const handleUploadClick = () => {
    // clickRef(uploadFileRef);
    dialog.showOpenDialog({properties: ['openDirectory']}).then((result: any) => {
      if (result.canceled) return;
      const filePath = result.filePaths[0];
      handleUploadValChange(filePath);
    })
  }
  const handleUploadValChange = (filePath: string) => {
    const file_obj = {
      'path': filePath || "",
    }
    if (filePath && filePath !== "") {
      props.onFileChange(file_obj);
    }
  }
  const handleActionValChange = (e: any) => {
    props.onActionChange(e.target.value);
  }

  const validFileObj = props.fileObj['path'] !== "";
  const dirName = fileNameFromPath(props.fileObj['path']) ?? "";

  const validateFileNameInput = () => {
    if (!fileNameIsValid(props.fileName)) {
      props.onFileNameErrorChange(true);
    } else {
      props.onFileNameErrorChange(false);
    }
    return;
  }

  const fileNameIsValid = (fileName: string) => {
    const isEmpty = fileName === "";
    const containsPeriod = fileName && fileName.indexOf('.') > -1;
    return !isEmpty && !containsPeriod;
  }

  const fileExists = (dirPath: string, fileName: string) => {
    if (!dirPath || !fileName) {
      props.onFileExistsChange(true);
      props.onFileExistCheckChange(true);
    }
    const path = pathGivenDir(dirPath, `${fileName}${props.fileNameExt}`);
    props.onFilePathChange(path);
    pathExists(path).then((exists) => {
      props.onFileExistsChange(exists);
      props.onFileExistCheckChange(true);
    })
  }

  const getTextInputErrorText = () => {
    if (props.fileNameError) {
      return "Enter non-empty export file name with no extension or periods";
    }
    if (!props.fileExistCheck) {
      return `Check if ${props.fileName}${props.fileNameExt} exists`;
    }
    if (props.fileExists) {
      return `${props.fileName}${props.fileNameExt} already exists in the directory or is invalid`;
    }
  }

  useEffect(() => {
    props.onFileExistsChange(false);
    props.onFileExistCheckChange(false);
  }, [props.fileName])

  const exportOnly = props.exportOnly ?? false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
        <FormControl
          className={classes.actionSelectDropdown}
        >
          <InputLabel>Action</InputLabel>
          <Select
            value={props.action ?? "temp"}
            onChange={handleActionValChange}
          >
            {
              !exportOnly && 
              <MenuItem value={"temp"}>Temporary View</MenuItem>
            }
            <MenuItem value={"export"}>{props.exportLabel}</MenuItem>
          </Select>
        </FormControl>

        {
          props.action === "export" &&
          <Button
              variant="contained"
              id="color-themed"
              className="containedBtn"
              onClick={() => handleUploadClick()}
          >
              {
                dirName === "" ?
                "Export Destination"
                :
                dirName
              }
          </Button>
        }

        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            props.action === "export" && 
            validFileObj && 
            <TextInputWithError 
              key = {"File Name Input"}
              error = {props.fileNameError || props.fileExists || !props.fileExistCheck}
              onInputChange = {props.onFileNameChange}
              validateInput = {validateFileNameInput}
              value = {props.fileName}
              label = {"Export File Name"}
              errorHelperText = {getTextInputErrorText() ?? "Error!"}
              regHelperText = {`File will be exported with ${props.fileNameExt} extension`}
            />
          }
          {
            props.action === "export" && 
            validFileObj &&
            !props.fileNameError && 
            <Button
              id="color-themed"
              className="btn"
              onClick={() => fileExists(props.fileObj['path'], props.fileName)}
            >
              File Exists?
            </Button>
          }
        </div>

    </div>
  )

}