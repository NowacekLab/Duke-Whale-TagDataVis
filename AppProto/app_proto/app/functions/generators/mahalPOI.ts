import {handleProcessMahalPOI, mahalPOICMDArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleMahalPOIAction(args: mahalPOICMDArgs) {
  try {
    const resp = await handleProcessMahalPOI(args);
    throwErrIfFail(resp);
    return successResponse("Successfully processed video file action.");
  } catch (error) {
    return failResponse(error);
  }
}