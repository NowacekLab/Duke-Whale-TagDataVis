import { failResponse, successResponse, throwErrIfFail } from "../responses";
import {writeObjToPath, pathGivenDir, editBatchInfoAttr} from '../files';

export async function editorSave(parentDir: string, batchName: string, graphName: string, graphObj: any) {

  try { 

    const savePath = pathGivenDir(parentDir, `${graphName}.json`);
    const saveObjRes = await writeObjToPath(savePath, graphObj);
    throwErrIfFail(saveObjRes);
    const saveGraphObj = {
      [graphName]: savePath
    }
    const saveInfoRes = await editBatchInfoAttr(batchName, 'genGraphs', saveGraphObj);
    throwErrIfFail(saveInfoRes);

    return successResponse("Successfully saved graph");
  } catch (error) {
    return failResponse("Failed to save graph");
  }
}