import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import WaveletsStepper from './WaveletsStepper';

interface WaveletsDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onWaveletsStart: Function,
}

export default function WaveletsDialog(props: WaveletsDialogProps) {

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
      
      <WaveletsStepper 
        onWaveletsStart={props.onWaveletsStart}
      />

    </WrapWithDialog>
  )


}