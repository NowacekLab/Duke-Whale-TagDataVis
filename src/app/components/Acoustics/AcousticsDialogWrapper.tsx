import React, {useState} from 'react';
import AcousticsDialog from './AcousticsDialog';
import {useDispatch} from 'react-redux';
import { throwErrIfFail } from '../../functions/responses';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {handleAcousticsAction} from '../../functions/generators/acoustics';
import {showPathInFileManager} from '../../functions/files';

interface AcousticsDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function AcousticsDialogWrapper(props: AcousticsDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Acoustics");

  async function onAcousticsStart (wavFilePath: string, filePath: string, isExport: boolean) {
    props.handleClose();
    const animArgs = {
        wavFilePath: wavFilePath,
        newFilePath: filePath,
        isExport: isExport ? "True" : "False",
    } 
    try {
        const res = await handleAcousticsAction(animArgs);
        throwErrIfFail(res);
        if (isExport) showPathInFileManager(filePath);
        notifActionHandler.showSuccessNotif("Successfully processed acoustics action");
    } catch (error) {
        notifActionHandler.showErrorNotif("Failed to process acoustics action");
    }
  }

  return(

    <AcousticsDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Acoustics"}
      onAcousticsStart={onAcousticsStart}
    />

  )


}