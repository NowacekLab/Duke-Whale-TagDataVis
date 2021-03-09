import {handleExportFile, exportCMDLineArgs} from "../exec/process";
import { failResponse, successResponse } from "../responses";

export async function exportFile(args: exportCMDLineArgs) {
  try {

    await handleExportFile(args);

    return successResponse("Successfully exported files");
  } catch (error) {
    console.log(error);
    return failResponse("Failed to export files");
  }
}