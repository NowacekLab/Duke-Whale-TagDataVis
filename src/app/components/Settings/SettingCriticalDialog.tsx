import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import SettingsCritical from './SettingsCritical';

interface SettingsCriticalDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
}

export default function SettingCriticalDialog(props: SettingsCriticalDialogProps) {

  return (
    <WrapWithDialog
      showModal={props.showModal}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Critical"}
      bodyStyle={{
        minWidth: "500px",
        padding: "10px",
        gap: "10px"
      }}
    >
      <SettingsCritical 
        onClose={props.handleClose}
      />
    </WrapWithDialog>
  )

}
