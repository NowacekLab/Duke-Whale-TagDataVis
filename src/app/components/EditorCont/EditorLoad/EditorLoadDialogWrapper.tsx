import React from 'react';
import EditorLoadDialog from './EditorLoadDialog';
import { throwErrIfFail } from '../../../functions/responses';
import {useDispatch} from 'react-redux';
import {notifsActionsHandler} from '../../../functions/reduxHandlers/handlers';

interface ExportHTMLDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
  onDataLoad: Function,
}

export default function ExportHTMLDialogWrapper(props: ExportHTMLDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Export HTML");

  const onDataLoad = (graphPath: string) => {
    props.handleClose();
    props.onDataLoad(graphPath);
  }

  return (
    <EditorLoadDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Load Graph"}
      onDataLoad={onDataLoad}
    />
  )

}