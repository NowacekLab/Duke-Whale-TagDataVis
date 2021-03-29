import React from 'react';
import EditorSaveDialog from './EditorSaveDialog';
import {useDispatch} from 'react-redux';
import {notifsActionsHandler} from '../../../functions/reduxHandlers/handlers';

interface ExportSaveDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
  onSave: Function,
}

export default function ExportSaveDialogWrapper(props: ExportSaveDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Export HTML");

  return (
    <EditorSaveDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Save Graph"}
      onSave={props.onSave}
    />
  )

}