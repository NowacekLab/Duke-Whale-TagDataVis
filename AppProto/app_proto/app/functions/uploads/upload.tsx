import {handleProcessFile} from "../exec/process";
import {throwErrIfFail, failResponse, successResponse} from "../responses";
import {handleGenerate} from "../exec/generate";
import {handleGenSave} from "../exec/save";
import {uploadFinishedObjects, uploadFinishedObj, uploadArgs, uploadInfo} from "../uploads/uploadsTypes";
import {getFileInfoPath, fileNameFromPath} from "../paths";
import {pathExists, getObjFromPath} from "../files";

export async function loadFinishedUploads() {
    const fileInfoPath = getFileInfoPath();
    const fileInfoExists = await pathExists(fileInfoPath);
    if (!fileInfoExists) {
        return {};
    }


    console.log("Load finished uploads")

    const fileInfoObj = await getObjFromPath(fileInfoPath);

    console.log(fileInfoObj);


    const finishedUploads = {} as uploadFinishedObjects;
    let curr_i = 0;
    for (let fileName in fileInfoObj) {


        console.log("filename: ");
        console.log(fileName);


        const finishedUpload = {} as uploadFinishedObj;
        finishedUpload["index"] = curr_i;
        const fileInfo = fileInfoObj[fileName];
        

        console.log("file info")
        console.log(fileInfo)


        const uploadInfo = fileInfo["uploadInfo"];
        const batchInfo = uploadInfo["batchInfo"];
        const batchInfoArr = [
                {
                    title: "Data File Name",
                    info: fileNameFromPath(batchInfo["dataFilePath"])
                },
                {   
                    title: "Log File Name",
                    info: fileNameFromPath(batchInfo["logFilePath"])
                },
                {
                    title: "GPS File Name",
                    info: fileNameFromPath(batchInfo["gpsFilePath"])
                },
                {
                    title: "Starting Latitude and Longitude",
                    info: `Lat (${batchInfo["startLatitude"]}), Long (${batchInfo["startLongitude"]})`
                }
            ];


        const batchName = uploadInfo["batchName"];

        const realUploadInfo = {
            batchName: batchName,
            batchInfo: batchInfoArr
        }

        //@ts-ignore 
        finishedUpload["uploadInfo"] = realUploadInfo;

        finishedUploads[curr_i] = finishedUpload;

        curr_i++;
    }

    return finishedUploads;
}

export function uploadArgKeyToTitle(key: string) {
    switch (key) {
        case "dataFilePath":
            return "Data File Name";
        case "logFilePath":
            return "Log File Name";
        case "gpsFilePath":
            return "GPS File Name";
        case "startLatitude":
            return "Starting Latitude";
        case "startLongitude":
            return "Starting Longitude";
    }
}

export function uploadArgKeyToInfo(key: string, info: string) {

}

export async function uploadFile(uploadArgs: uploadArgs, uploadInfo: uploadInfo, updateUploadProgress: Function) {
    const batchName = uploadInfo["batchName"];
    try {
        console.log("Upload Args");
        console.log(uploadArgs);

        //@ts-ignore
        const procResult = await handleProcStep(uploadArgs, updateUploadProgress);

        console.log("Process result");
        console.log(procResult);

        const genResult = await handleGenStep(uploadArgs, updateUploadProgress);

        console.log("Generate result");
        console.log(genResult);

        const saveResult = await handleSaveStep(uploadArgs, updateUploadProgress, genResult, uploadInfo);

        console.log("Save result");
        console.log(saveResult);

        return successResponse(`Successfully uploaded batch ${batchName}`);

    } catch (error) {
        console.log(error);
        failUploadProgress(updateUploadProgress);
        return failResponse(`Failed to upload batch ${batchName}`);
    }
}

async function handleProcStep(uploadArgs: uploadArgs, updateUploadProgress: Function) {

    const handler = handleProcessFile;
    const progKey = "processing";

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, updateUploadProgress);
}

async function handleGenStep(uploadArgs: uploadArgs, updateUploadProgress: Function) {

    const handler = handleGenerate;
    const progKey = "generating";

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, updateUploadProgress);
}

async function handleSaveStep(uploadArgs: uploadArgs, updateUploadProgress: Function, genRes: any, uploadInfo: uploadInfo) {

    const handler = handleGenSave;
    const progKey = "saving";
    const addArgs = [genRes, uploadInfo]

    return await handleUploadStepGeneric(handler, progKey, uploadArgs, updateUploadProgress, addArgs);

}

async function handleUploadStepGeneric(handler: Function, progKey: string, uploadArgs: uploadArgs, updateUploadProgress: Function, addArgs?: Array<any>) {
    let resp;
    if (addArgs === undefined) {
        resp = await handler(uploadArgs);
    } else {
        resp = await handler(...addArgs, uploadArgs);
    }
    throwErrIfFail(resp);

    updateUploadProgressWrapper(progKey, resp.success, updateUploadProgress);

    return resp.response;
}

function failUploadProgress(updateUploadProgress: Function) {
    const progKeys = ["processing", "generating", "saving"];
    for (let idx in progKeys) {
        const progKey = progKeys[idx];
        updateUploadProgress(progKey, "fail");
    }
}

function updateUploadProgressWrapper(progKey: string, success: boolean, updateUploadProgress: Function) {

    const newProgKeyVal = getNewProgVal(success);
    
    updateUploadProgress(progKey, newProgKeyVal);

    return newProgKeyVal; 
}

function getNewProgVal(success: boolean) {
    return success ? "finished" : "fail";
}