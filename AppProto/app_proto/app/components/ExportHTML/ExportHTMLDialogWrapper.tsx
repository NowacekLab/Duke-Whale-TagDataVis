import React from 'react';
import ExportHTMLDialog from './ExportHTMLDialog';
import {handleExportHTMLAction} from '../../functions/generators/exportHTML';
import { throwErrIfFail } from '../../functions/responses';
import {useDispatch} from 'react-redux';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {showPathInFileManager} from '../../functions/files';

interface ExportHTMLDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function ExportHTMLDialogWrapper(props: ExportHTMLDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Export HTML");

  async function onExportStart(graphFilePath: string, filePath: string) {

    props.handleClose();

    const args = {
      graphFilePath: graphFilePath,
      newFilePath: filePath,
    }
    
    try {
      const res = await handleExportHTMLAction(args);
      throwErrIfFail(res);
      showPathInFileManager(filePath);
      notifActionHandler.showSuccessNotif("Successfully exported HTML file");
    } catch (error) {
      notifActionHandler.showErrorNotif("Failed to export HTML file");
    }


    return;                          
  }

  return (
    <ExportHTMLDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Export HTML"}
      onExportStart={onExportStart}
    />
  )

}