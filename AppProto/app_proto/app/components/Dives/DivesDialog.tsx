import React from 'react';
import WrapWithDialog from '../WrapWithDialog';
import DiveStepper from './DivesStepper';

interface DivesDialogProps {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  title: string,
  onDivesStart: Function,
}

export default function DivesDialog(props: DivesDialogProps) {

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
      
      <DiveStepper 
        onDivesStart={props.onDivesStart}
      />

    </WrapWithDialog>
  )


}