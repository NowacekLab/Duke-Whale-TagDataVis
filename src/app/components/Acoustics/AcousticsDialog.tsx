import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import AcousticsStepper from './AcousticsStepper';

interface AcousticsDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onAcousticsStart: Function,
}

export default function AcousticsDialog(props: AcousticsDialogProps) {

  return (

    <WrapWithDialog
      showModal={props.showModal}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={props.title}
      bodyStyle={{
        minWidth: '500px'
      }}
    >
      
      <AcousticsStepper 
        onAcousticsStart={props.onAcousticsStart}
      />

    </WrapWithDialog>
  )


}