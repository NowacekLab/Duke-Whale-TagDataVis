import React from 'react';
import WrapWithDialog from '../WrapWithDialog';

type ExportDialogProps = {
  showExportDialog: boolean,
  handleExportDialogClose: any,
  beginExport: any,
}

export default function ExportDialog(props: ExportDialogProps) {

  return (
    <WrapWithDialog
      showModal={props.showExportDialog}
      handleClose={props.handleExportDialogClose}
      handleBack={props.handleExportDialogClose}
      title={"Export"}
    >


    </WrapWithDialog>

  )

}