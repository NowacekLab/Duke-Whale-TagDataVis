import React, {useState} from 'react';
import AnimatedDialog from './AnimatedDialog';
import {useDispatch} from 'react-redux';
import { throwErrIfFail } from '../../functions/responses';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {handleVideoFileAction} from '../../functions/generators/videofile';
import {showPathInFileManager} from '../../functions/files';

interface AnimatedDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function AnimatedDialogWrapper(props: AnimatedDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Animate");

  async function onAnimateStart (calcFilePath: string, filePath: string, isExport: boolean) {
    props.handleClose();
    const animArgs = {
        calcFilePath: calcFilePath,
        newFilePath: filePath,
        isExport: isExport ? "True" : "False",
    } 
    try {
        const res = await handleVideoFileAction(animArgs);
        throwErrIfFail(res);
        if (isExport) showPathInFileManager(filePath);
        notifActionHandler.showSuccessNotif("Successfully processed animation action");
    } catch (error) {
        notifActionHandler.showErrorNotif("Failed to process animation action");
    }
  }

  return(

    <AnimatedDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"3D Animation"}
      onAnimateStart={onAnimateStart}
    />

  )


}