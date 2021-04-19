import React from 'react';
import WrapWithDialog from '../../WrapWithDialog';
import EditorSaveStepper from './EditorSaveStepper';

interface EditorSaveDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onSave: Function
}

export default function EditorSaveDialog(props: EditorSaveDialogProps) {

  const onSave = (batchDir: string, batchName: string, fileName: string) => {
    props.handleClose();
    props.onSave(batchDir, batchName, fileName);
  }

  return (
    <WrapWithDialog
      showModal={props.showModal}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={props.title}
      bodyStyle={{
        minWidth: "700px"
      }}
    >
      <EditorSaveStepper 
        onSave={onSave}
      />
    </WrapWithDialog>
  )
}