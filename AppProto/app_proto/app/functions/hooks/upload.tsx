import {handleProcessFile} from "../exec/process";
import {throwErrIfFail, failResponse, successResponse} from "../responses";
import {handleGenerate} from "../exec/generate";
import {handleGenSave} from "../exec/save";
import {uploadArgs, uploadProgress} from "./useUpload";

export async function uploadFile(uploadArgs: uploadArgs, uploadProgress: uploadProgress, updateUploadProgress: Function) {

    try {
        console.log("Upload Args");
        console.log(uploadArgs);

        //@ts-ignore
        const procResult = await handleProcStep(uploadArgs, uploadProgress, updateUploadProgress);

        console.log("Process result");
        console.log(procResult);

        const genResult = await handleGenStep(uploadArgs, uploadProgress, updateUploadProgress);

        console.log("Generate result");
        console.log(genResult);

        const saveResult = await handleSaveStep(uploadArgs, uploadProgress, updateUploadProgress, genResult);

        console.log("Save result");
        console.log(saveResult);

    } catch (error) {
        console.log(error);
        failUploadProgress(uploadProgress, updateUploadProgress);
    }
}

async function handleProcStep(uploadArgs: uploadArgs, uploadProgress: uploadProgress, updateUploadProgress: Function) {

    const handler = handleProcessFile;
    const progKey = "process";

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, uploadProgress, updateUploadProgress);
}

async function handleGenStep(uploadArgs: uploadArgs, uploadProgress: uploadProgress, updateUploadProgress: Function) {

    const handler = handleGenerate;
    const progKey = "generate";

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, uploadProgress, updateUploadProgress);
}

async function handleSaveStep(uploadArgs: uploadArgs, uploadProgress: uploadProgress, updateUploadProgress: Function, genRes: any) {

    const handler = handleGenSave;
    const progKey = "save";
    const addArgs = [genRes]

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, uploadProgress, updateUploadProgress, addArgs);

}

async function handleUploadStepGeneric(handler: Function, progKey: string, uploadArgs: uploadArgs, uploadProgress: uploadProgress, updateUploadProgress: Function, addArgs?: Array<any>) {
    let resp;
    if (addArgs === undefined) {
        resp = await handler(uploadArgs);
    } else {
        resp = await handler(...addArgs, uploadArgs);
    }
    throwErrIfFail(resp);

    updateUploadProgressWrapper(progKey, resp.success, uploadProgress, updateUploadProgress);

    return resp.response;
}

function failUploadProgress(uploadProgress: uploadProgress, updateUploadProgress: Function) {
    const failedUploadProgress = getFailedUploadProgress(uploadProgress);
    updateUploadProgress(failedUploadProgress);
}

function getFailedUploadProgress(uploadProgress: uploadProgress) {
    for (let progKey in uploadProgress) {
        const inProgress = stepInProgress(progKey, uploadProgress);
        const failedStepVal = getNewProgVal(false);
        if (!inProgress) {
            uploadProgress[progKey] = failedStepVal;
        }
    }

    return uploadProgress;

}

function stepInProgress(progKey: string, uploadProgress: uploadProgress) {
    const failStepVal = getNewProgVal(false);
    const successStepVal = getNewProgVal(true);
    const stepVal = uploadProgress[progKey];
    return (stepVal !== failStepVal && successStepVal !== stepVal);
} 

function updateUploadProgressWrapper(progKey: string, success: boolean, uploadProgress: uploadProgress, updateUploadProgress: Function) {

    const newUploadProgress = getNewUploadProgress(progKey, success, uploadProgress);
    
    updateUploadProgress(newUploadProgress);

    return newUploadProgress; 
}

function getNewUploadProgress(progKey: string, success: boolean, uploadProgress: uploadProgress) {

    const newUploadProgress = Object.assign(uploadProgress);
    newUploadProgress[progKey] = getNewProgVal(success);
    return newUploadProgress;
}

function getNewProgVal(success: boolean) {
    return success ? "success" : "fail";
}