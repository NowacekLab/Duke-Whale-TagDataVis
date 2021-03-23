import React from 'react';
import SettingsDialog from './SettingsDialog';

interface SettingsWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function
}

export default function SettingsWrapper(props: SettingsWrapperProps) {

    return (
      <SettingsDialog 
        showModal={props.showDialog}
        handleClose={props.handleClose}
        handleBack={props.handleBack}
        title={"Settings"}
      />
    )

}