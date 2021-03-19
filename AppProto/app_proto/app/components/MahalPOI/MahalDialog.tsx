import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import MahalStepper from './MahalStepper';

interface AnimatedDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onMahalPOIStart: Function,
}

export default function AnimatedDialog(props: AnimatedDialogProps) {

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
      
      <MahalStepper 
        onMahalPOIStart={props.onMahalPOIStart}
      />

    </WrapWithDialog>
  )


}