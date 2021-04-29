import React, {useState, useEffect} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";
import TextInputWithError from '../../TextInputWithError';
// import {fileNameFromPath} from '../functions/paths';
import {pathExists, pathGivenDir} from '../../../functions/files';
import {getSaveDirPath} from '../../../functions/paths';

interface SelectActionProps {
  onFileNameChange: Function,
  fileName: string,
  onFileNameErrorChange: Function,
  fileNameError: boolean,
  fileExistCheck: boolean,
  onFileExistCheckChange: Function,
  fileExists: boolean,
  onFileExistsChange: Function,
  batchDir: string,
}

export default function EditorSaveAction(props: SelectActionProps) {

  const batchDir = props.batchDir;

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

    const path = pathGivenDir(dirPath, `${fileName}.json`);


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
      return `Check if ${props.fileName}.json exists`;
    }
    if (props.fileExists) {
      return `${props.fileName}.json already exists in the directory or is invalid`;
    }
  }

  useEffect(() => {
    props.onFileExistsChange(false);
    props.onFileExistCheckChange(false);
  }, [props.fileName])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >

        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            <TextInputWithError 
              key = {"Graph Name Input"}
              error = {props.fileNameError || props.fileExists || !props.fileExistCheck}
              onInputChange = {props.onFileNameChange}
              validateInput = {validateFileNameInput}
              value = {props.fileName}
              label = {"Graph Name"}
              errorHelperText = {getTextInputErrorText() ?? "Error!"}
              regHelperText = {`File will be saved with .json extension`}
            />
          }
          {
            !props.fileNameError && 
            <Button
              id="color-themed"
              className="btn"
              onClick={() => fileExists(batchDir, props.fileName)}
            >
              File Exists?
            </Button>
          }
        </div>

    </div>
  )

}