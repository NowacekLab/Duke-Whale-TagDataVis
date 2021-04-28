import {handleProcessDives, divesCMDLineArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleDivesAction(args: divesCMDLineArgs) {
  try {
    const resp = await handleProcessDives(args);
    throwErrIfFail(resp);
    return successResponse("Successfully processed dives action.");
  } catch (error) {
    return failResponse(error);
  }
}