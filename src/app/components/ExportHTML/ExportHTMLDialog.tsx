import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import ExportHTMLStepper from './ExportHTMLStepper';

interface ExportHTMLDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onExportStart: Function,
}

export default function ExportHTMLDialog(props: ExportHTMLDialogProps) {

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
        onExportStart={props.onExportStart}
      />

    </WrapWithDialog>
  )
}