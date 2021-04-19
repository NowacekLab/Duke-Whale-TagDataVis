import React, {useState} from 'react';
import EditorLoadDialogWrapper from './EditorLoadDialogWrapper';
import Button from "@material-ui/core/Button";

interface EditorSaveBtnProps {
  style?: any,
  onDataLoad: Function,
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
          Load Graph
      </Button>

      <EditorLoadDialogWrapper 
        showDialog={showDialog}
        handleClose={handleDialogClose}
        handleBack={handleDialogClose}
        onDataLoad={props.onDataLoad}
      />

    </React.Fragment>
  )
}