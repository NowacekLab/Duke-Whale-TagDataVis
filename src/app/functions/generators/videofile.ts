import {handleProcessVideoFile, videoFileCMDLineArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleVideoFileAction(args: videoFileCMDLineArgs) {
  try {
    const resp = await handleProcessVideoFile(args);
    throwErrIfFail(resp);
    return successResponse("Successfully processed video file action.");
  } catch (error) {
    return failResponse(error);
  }
}