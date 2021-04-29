import React from 'react';
import WrapWithDialog from '../../WrapWithDialog';
import ExportHTMLStepper from './EditorLoadStepper';

interface ExportHTMLDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onDataLoad: Function,
}

export default function EditorLoadDialog(props: ExportHTMLDialogProps) {

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
      <ExportHTMLStepper 
        onDataLoad={props.onDataLoad}
      />

    </WrapWithDialog>
  )
}