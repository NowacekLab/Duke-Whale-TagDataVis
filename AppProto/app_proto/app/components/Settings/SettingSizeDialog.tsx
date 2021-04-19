import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import SettingsSize from './SettingsSize';

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
      title={"Window Size"}
      bodyStyle={{
        minWidth: "500px",
        padding: "10px",
        gap: "10px"
      }}
    >
      <SettingsSize 
        onClose={props.handleClose}
      />
    </WrapWithDialog>
  )

}
