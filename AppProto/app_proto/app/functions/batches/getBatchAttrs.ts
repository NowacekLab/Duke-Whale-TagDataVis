import {uploadFinishedObjects} from '../uploads/uploadsTypes';
import {getKeyFromObj} from '../object_helpers';
import {failResponse, throwErrIfFail, successResponseAny, successResponse} from '../responses';
import { getObjFromPath } from '../files';

export async function getBatchVars(finishedUploads: uploadFinishedObjects,
                                    batchName: string) {
  try {
    const batchColsRes = await getBatchCols(finishedUploads, batchName);

    throwErrIfFail(batchColsRes);
    const batchColsJSON = batchColsRes.response; 

    const batchVars = Object.keys(batchColsJSON);

    return successResponseAny(batchVars); 
  } catch (err) {
    console.log(err);
    return failResponse(err);
  }
  
}

export async function getBatchCols(finishedUploads: uploadFinishedObjects, 
                                    batchName: string) {
  try {
    const batchColsObjRes = await getAttrFromBatch(finishedUploads, batchName, "cols");

    throwErrIfFail(batchColsObjRes);
    const batchColsObj = batchColsObjRes.response;

    const batchColsPathRes = getKeyFromObj(batchColsObj, "cols.json");
    throwErrIfFail(batchColsPathRes);
    const batchColsPath = batchColsPathRes.response;
    const colsJSON = await getObjFromPath(batchColsPath);

    return successResponseAny(colsJSON);
  } catch (err) {
    return failResponse(err);
  }
}

export async function getAttrFromBatch(finishedUploads: uploadFinishedObjects, 
                                        batchName: string, attribute: string) {
  try {
    const batchInfoRes = await getBatchInfo(finishedUploads, batchName);
    throwErrIfFail(batchInfoRes);
    const batchInfo = batchInfoRes.response;
    const attrRes = getKeyFromObj(batchInfo, attribute);
    throwErrIfFail(attrRes);
    const attr = attrRes.response;
    return successResponseAny(attr); 
  } catch (err) {
    return failResponse(err);
  }                   
}

export async function getBatchInfo(finishedUploads: uploadFinishedObjects, 
                                    batchName: string) {
  try {

    const batchInfoRes = getKeyFromObj(finishedUploads, batchName);
    throwErrIfFail(batchInfoRes);
    const batchInfo = batchInfoRes.response;
    return successResponseAny(batchInfo);
  } catch (err) {
    return failResponse(err);
  }

}