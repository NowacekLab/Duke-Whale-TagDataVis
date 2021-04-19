import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import AnimatedStepper from './AnimatedStepper';

interface AnimatedDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onAnimateStart: Function,
}

export default function AnimatedDialog(props: AnimatedDialogProps) {

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
      
      <AnimatedStepper 
        onAnimateStart={props.onAnimateStart}
      />

    </WrapWithDialog>
  )


}