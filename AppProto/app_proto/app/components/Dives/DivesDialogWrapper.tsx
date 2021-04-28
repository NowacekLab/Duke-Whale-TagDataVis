import React, {useState} from 'react';
import DivesDialog from './DivesDialog';
import {useDispatch} from 'react-redux';
import { throwErrIfFail } from '../../functions/responses';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {handleDivesAction} from '../../functions/generators/dives';
import {divesCMDLineArgs, divesParams} from '../../functions/exec/process';
import {showPathInFileManager} from '../../functions/files';

interface DivesDialogWrapperProps {
  showDialog: boolean,
  handleClose: Function,
  handleBack: Function,
}

export default function DivesDialogWrapper(props: DivesDialogWrapperProps) {

  const dispatch = useDispatch();

  // TODO: extract bottom animate action out of sidebar into own component for notif handler to get separate component name
  const notifActionHandler = new notifsActionsHandler(dispatch, "Dives");

  async function onDivesStart (calcFilePath: string, filePath: string, isExport: boolean,
                                variables: Array<string>, divesParams: divesParams) {
    props.handleClose();
    const divesArgs: divesCMDLineArgs = {
      calcFilePath: calcFilePath,
      newFilePath: filePath,
      isExport: isExport ? "True" : "False",
      minLength: divesParams['minLength'],
      requiredDepth: divesParams['requiredDepth'],
      maxDepth: divesParams['maxDepth'],
      interestVars: variables.join("ARRAYSEP"),
    }

    // props.onDivesStart(
    //     calcFilePath, filePath, isExport, 
    //     chosenBatchVars, divesParamsObj,
    //   )

    try {
      const res = await handleDivesAction(divesArgs);
      throwErrIfFail(res);
      if (isExport) showPathInFileManager(filePath);
      notifActionHandler.showSuccessNotif("Successfully processed mahal action");
    } catch (error) {
      notifActionHandler.showErrorNotif("Failed to process mahal action");
    }
    
    return;
  }

  return(

    <DivesDialog 
      showModal={props.showDialog}
      handleClose={props.handleClose}
      handleBack={props.handleBack}
      title={"Dives"}
      onDivesStart={onDivesStart}
    />

  )


}