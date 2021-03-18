import React, {useRef, useState} from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from "@material-ui/core/Button";

const {dialog} = require('electron').remote;

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

interface AnimateSelectActionProps {
  action: string,
  onActionChange: Function,
  fileObj: any,
  onFileChange: Function,
}

export default function AnimateSelectAction(props: AnimateSelectActionProps) {

  const classes = useStyles();

  const uploadFileRef = useRef(null);
  const clickRef = (ref: any) => {
    ref && ref.current ? ref.current.click() : null;
  }
  const handleUploadClick = () => {
    // clickRef(uploadFileRef);
    dialog.showOpenDialog({properties: ['openDirectory']}).then(result => {
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
            <MenuItem value={"temp"}>Temporary View</MenuItem>
            <MenuItem value={"export"}>Export GIF</MenuItem>
          </Select>
        </FormControl>

        {
          props.action === "export" &&
          <Button
              variant="contained"
              className={classes.containedBtn}
              onClick={() => handleUploadClick()}
          >
              {
                "Export Destination"
              }
          </Button>
        }

      {/* <input 
        type="file" 
        id="file-upload" 
        ref={uploadFileRef} 
        style={{display: "none"}} 
        onChange={(e) => handleUploadValChange(e)}
      /> */}
    </div>
  )

}