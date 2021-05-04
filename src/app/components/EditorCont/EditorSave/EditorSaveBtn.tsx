import React, {useState} from 'react';
import EditorSaveDialogWrapper from './EditorSaveDialogWrapper';
import Button from "@material-ui/core/Button";

interface EditorSaveBtnProps {
  style?: any,
  onSave: Function,
}

export default function EditorSaveBtn(props: EditorSaveBtnProps) {
  
  const [showDialog, setShowDialog] = useState(false);
  const handleDialogClose = () => {
    setShowDialog(false);
  }

  return (
    <React.Fragment>
      <Button
          id="color-themed"
          className="btn"
          onClick={() => setShowDialog(true)}
          style={{
            ...props.style,
          }}
        >
          Save Graph
      </Button>

      <EditorSaveDialogWrapper 
        showDialog={showDialog}
        handleClose={handleDialogClose}
        handleBack={handleDialogClose}
        onSave={props.onSave}
      />

    </React.Fragment>
  )
}