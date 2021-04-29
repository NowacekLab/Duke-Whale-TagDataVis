import React, {useState} from 'react';
import WrapWithDialog from '../WrapWithDialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

interface SettingsCriticalExecProps {
  verifyUserText: string, 
  onActionExec: Function, 
  onClose: Function,
}

export default function SettingsCriticalExec(props: SettingsCriticalExecProps) {

  const [showDialog, setShowDialog] = useState(false);
  const [textVal, setTextVal] = useState("");
  const onTextChange = (e: any) => {
    setTextVal(e.target.value ?? "");
  }

  const onActionExec = () => {
    props.onClose();
    props.onActionExec();
  }

  return (
    <>
      <Button
        id="error-color-themed"
        className="btn"
        onClick={() => setShowDialog(true)}
      >
        Execute
      </Button>

      <WrapWithDialog
        showModal={showDialog}
        handleClose={() => setShowDialog(false)}
        handleBack={() => setShowDialog(false)}
        title={"Confirm"}
        bodyStyle={{
          minWidth: "500px",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        innerBodyStyle={{
          minWidth: "400px"
        }}
      >
        <div
          className="flex-col-center"
          style={{
            maxWidth: "500px",
            gap: "10px"
          }}
        >
          <TextField 
            label="Type text below to confirm"
            value={textVal}
            onChange={onTextChange}
            helperText={props.verifyUserText}
            style={{
              width: "100%"
            }}
          />

          <Button
            id="error-color-themed"
            className="btn"
            disabled={textVal !== props.verifyUserText}
            onClick={onActionExec}
            style={{
              opacity: textVal !== props.verifyUserText ? 0.5 : 1
            }}
          >
            Execute 
          </Button>
        </div>
      </WrapWithDialog>
    
    </>
  )

}