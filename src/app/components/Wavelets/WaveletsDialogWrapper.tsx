import React, {useState} from 'react';
import WaveletsDialog from './WaveletsDialog';
import {useDispatch} from 'react-redux';
import { throwErrIfFail } from '../../functions/responses';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {handleWaveletsAction} from '../../functions/generators/wavelets';
import {waveletsCMDLineArgs, wavesParams} from '../../functions/exec/process';
import {showPathInFileManager} from '../../functions/files';

interface WaveletsDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function WaveletsDialogWrapper(props: WaveletsDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Wavelets");

  async function onWaveletsStart(calcFilePath: string, newFilePathOne: string, newFilePathTwo: string,
                                isExportOne: string, isExportTwo: string, variable: string,
                                showLevels: string, waveletsParamsObj: wavesParams) {
    props.handleClose();
    const waveletsArgs: waveletsCMDLineArgs = {
      calcFilePath: calcFilePath,
      newFilePathOne: newFilePathOne,
      newFilePathTwo: newFilePathTwo,
      isExportOne: isExportOne,
      isExportTwo: isExportTwo,
      variable: variable,
      showLevels: showLevels,
      depthLimit: waveletsParamsObj['depthLimit'],
      colorByVar: waveletsParamsObj['colorByVar']
    }

    try {
      const res = await handleWaveletsAction(waveletsArgs);
      throwErrIfFail(res);
      if (isExportOne) showPathInFileManager(newFilePathOne); 
      if (isExportTwo) showPathInFileManager(newFilePathTwo);
      notifActionHandler.showSuccessNotif("Successfully processed wavelets action");
    } catch (error) {
      notifActionHandler.showErrorNotif("Failed to process wavelets action");
    }
    
    return;
  }

  return(

    <WaveletsDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Wavelets"}
      onWaveletsStart={onWaveletsStart}
    />

  )


}