import React from 'react';
import SettingsBody from './SettingsBody';
import WrapWithDialog from '../WrapWithDialog';

interface SettingsDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
}

export default function SettingsDialog(props: SettingsDialogProps) {


  return (
    <WrapWithDialog
      showModal={props.showModal}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={props.title}
      bodyStyle={{
        minWidth: "500px",
        padding: "10px",
        gap: "10px"
      }}
    >
      <SettingsBody 
        onClose={props.handleClose}
      />
    </WrapWithDialog>
  )

}