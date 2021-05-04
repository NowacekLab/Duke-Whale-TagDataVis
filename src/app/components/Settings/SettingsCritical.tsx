import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import SettingsCriticalExec from './SettingsCriticalExec';
import { showUserSaveFilesInFileManager } from '../../functions/files';
import {reset} from '../../functions/reset';

interface SettingsCriticalProps {
  onClose: Function,
}

export default function SettingsCritical(props: SettingsCriticalProps) {

  const [action, setAction] = useState("user");

  const handleActionChange = (e: any) => {
    setAction(e.target.value ?? "user");
  }

  const getVerificationText = () => {
    switch (action) {
      case "user":
        return "access-private-program-files"
      case "reset":
        return "reset-everything"
      default:
        return "invalid-action"
    }
  }

  const onActionExec = () => {
    switch (action) {
      case "user":
        showUserSaveFilesInFileManager();
        break;
      case "reset":
        reset();
        break;
      default:
        break;
    }
  }

  return (
    <div
      className="flex-col-center"
      style={{
        gap: "10px"
      }}
    >

      <Typography>
        Danger Zone 
      </Typography>

      <p
        style={{
          padding: "0px",
          margin: "0px"
        }}
      >
        Be Careful: Irreversible Actions 
      </p>

      <FormControl
        style={{
          minWidth: "200px"
        }}
      >
        <InputLabel>Action</InputLabel>
        <Select
          value={action}
          onChange={handleActionChange}
        >
          <MenuItem value={"user"}>Access User Files</MenuItem>
          <MenuItem value={"reset"}>Reset</MenuItem>
        </Select>
      </FormControl>

      <SettingsCriticalExec 
        verifyUserText={getVerificationText()}
        onActionExec={onActionExec}
        onClose={props.onClose}
      />
      
    </div>
  )

}