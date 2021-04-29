import {handleExportHTML, exportHTMLCMDLineArgs} from '../exec/process';
import { failResponse, successResponse, throwErrIfFail } from '../responses';

export async function handleExportHTMLAction(args: exportHTMLCMDLineArgs) {
  try {
    const resp = await handleExportHTML(args);
    throwErrIfFail(resp);
    return successResponse("Successfully finished export HTML.");
  } catch (error) {
    return failResponse(error);
  }
}