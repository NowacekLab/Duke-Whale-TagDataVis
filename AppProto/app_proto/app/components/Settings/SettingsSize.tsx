import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

//@ts-ignore
const remote = require('electron').remote;

interface SettingsSizeProps {
  onClose: Function
}

export default function SettingsSize(props: SettingsSizeProps) {

  const dispatch = useDispatch();
  const notifActionHandler = new notifsActionsHandler(dispatch, "Settings");

  const [initWidth, initHeight] = remote.getCurrentWindow().getSize();
  const [width, setWidth] = useState(initWidth);
  const [height, setHeight] = useState(initHeight);

  const onSave = () => {
    try {
      let stringSettings = localStorage.getItem('settings') ?? '';
  
      const settings = stringSettings === '' ? {} : JSON.parse(stringSettings);
      const newSettings = {
        ...settings,
        size: {
          width: width,
          height: height,
        }
      }
  
      stringSettings = JSON.stringify(newSettings);
      localStorage.setItem('settings', stringSettings);

      notifActionHandler.showSuccessNotif("New window size saved");
      props.onClose();
    } catch (error) {
      notifActionHandler.showErrorNotif("Failed to save window size");
    }
  }

  remote.getCurrentWindow().on('resize', () => {
    const [width, height] = remote.getCurrentWindow().getSize();
    setWidth(width);
    setHeight(height);
  })

  return (
    <div
      className="flex-col-center"
      style={{
        gap: "10px",
      }}
    >

      <Typography>
        Screen Dimensions 
      </Typography>

      <div
        className="flex-row-center"
        style={{
          gap: "5px"
        }}
      >

        <TextField 
          label="Current Width"
          value={width}
          InputProps={{
            readOnly: true,
          }}
        />

        <span>
          X
        </span>

        <TextField 
          label="Current Height"
          value={height}
          InputProps={{
            readOnly: true,
          }}
        />


      </div>

      <p
        style={{
          textAlign: 'center'
        }}
      >
        Alter the window size and save to set your new preferred 
        window size. 
      </p>

      <Button
        id="color-themed"
        className="btn"
        onClick={onSave}
      >
        Save 
      </Button>

    </div>
  )

}
