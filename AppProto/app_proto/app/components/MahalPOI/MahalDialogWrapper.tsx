import React, {useState} from 'react';
import MahalDialog from './MahalDialog';
import {useDispatch} from 'react-redux';
import { throwErrIfFail } from '../../functions/responses';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {handleMahalPOIAction} from '../../functions/generators/mahalPOI';
import {mahalPOICMDArgs, mahalPOIParams} from '../../functions/exec/process';

interface AnimatedDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function AnimatedDialogWrapper(props: AnimatedDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Mahal POI");

  async function onMahalStart (calcFilePath: string, dirPath: string, newFileName: string, isExport: boolean,
                                variables: Array<string>, mahalPOIParams: mahalPOIParams) {
    props.handleClose();
    const mahalArgs: mahalPOICMDArgs = {
      calcFilePath: calcFilePath,
      newFileName: newFileName,
      targetDirectory: dirPath,
      isExport: isExport ? "True" : "False",
      variableOne: variables[0],
      variableTwo: variables[1],
      variableThree: variables[2],
      pLimit: mahalPOIParams['pLimit'],
      windowSize: mahalPOIParams['windowSize'],
      groupSize: mahalPOIParams['groupSize'],
      depthLimit: mahalPOIParams['depthLimit'],
    }

    console.log("GIVEN ARGS FOR MAHAL START: ");
    console.log(mahalArgs);

    try {
      const res = await handleMahalPOIAction(mahalArgs);
      throwErrIfFail(res);
      notifActionHandler.showSuccessNotif("Successfully processed mahal action");
    } catch (error) {
      console.log("MAHAL START ERROR");
      console.log(error);
      notifActionHandler.showErrorNotif("Failed to process mahal action");
    }
    
    return;
  }

  return(

    <MahalDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Mahal POI"}
      onMahalPOIStart={onMahalStart}
    />

  )


}