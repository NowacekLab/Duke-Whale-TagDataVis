import {handleProcessFile} from "../exec/process";
import {throwErrIfFail, failResponse, successResponse} from "../responses";
import {handleGenerate} from "../exec/generate";
import {handleGenSave} from "../exec/save";
import {uploadFinishedObjects, uploadFinishedObj, uploadInfo} from "../uploads/uploadsTypes";
import {getFileInfoPath, fileNameFromPath} from "../paths";
import {pathExists, getObjFromPath} from "../files";

export async function loadFileInfoArr() {
    console.log("Load File Info Array");

    const fileInfoPath = getFileInfoPath();
    const fileInfoExists = await pathExists(fileInfoPath);
    if (!fileInfoExists) {
        console.log("NO FILE INFO OBJECT FOUND.")
        return {};
    }

    const fileInfoObj = await getObjFromPath(fileInfoPath);

    console.log("FILE INFO OBJECT: ");
    console.log(fileInfoObj);

    const arr = [];

    for (let batchName in fileInfoObj) {

        const fileInfo = fileInfoObj[batchName];
        arr.push(fileInfo);
    }       

    return arr;
}

function getUploadInfoArr(uploadInfo: uploadInfo) {
    const uploadInfoArr = [
        {
            title: "Data File Name",
            info: uploadInfo["dataFileName"]
        },
        {   
            title: "Log File Name",
            info: uploadInfo["logFileName"]
        },
        {
            title: "GPS File Name",
            info: uploadInfo["gpsFileName"]
        },
        {
            title: "Starting Latitude and Longitude",
            info: `Lat (${uploadInfo["startLatitude"]}), Long (${uploadInfo["startLongitude"]})`
        }
    ];

    return uploadInfoArr; 
}

export async function loadFinishedUploads() {

    const fileInfoObj = await getFileInfo();
    console.log("FILE INFO OBJ");
    console.log(fileInfoObj);
    const finishedUploads = {} as uploadFinishedObjects;

    for (let batchName in fileInfoObj) {

        console.log("batchname: ");
        console.log(batchName);

        let fileInfo = fileInfoObj[batchName];
        if (!fileInfo) {
            fileInfo = {};
        }
        const graphs = fileInfo['genGraphs'];
        const cols = fileInfo['genCols'];
        const calcFilePath = fileInfo['calcFilePath'];
        const uploadInfo = fileInfo['uploadInfo'];
        const batchInfo = uploadInfo ? uploadInfo['batchInfo'] : {};
        const uploadInfoArr = getUploadInfoArr(batchInfo);

        const finishedUpload = {} as uploadFinishedObj;
        finishedUpload["graphs"] = graphs;
        finishedUpload["cols"] = cols;
        finishedUpload["calcPath"] = calcFilePath;
        finishedUpload["uploadInfo"] = batchInfo;
        finishedUpload["uploadInfoArr"] = uploadInfoArr;

        finishedUploads[batchName] = finishedUpload;
    }

    console.log("FINISHED UPLOADS OBJ");
    console.log(finishedUploads);

    return finishedUploads;
}

export async function loadUploadsForGraph() {

    const uploads = {} as Record<string, any>;

    const fileInfoObj = await getFileInfo();
    for (let batchName in fileInfoObj) {

        let fileInfo = fileInfoObj[batchName];
        const graphs = fileInfo["genGraphs"];

        const uploadObj = {} as Record<string, any>;
        uploadObj['graphs'] = graphs ? graphs: {};
        uploads[batchName] = uploadObj;
    }

    return uploads;
}

export async function loadUploadsForEditor() {
    const uploads = {} as Record<string, any>;
    const fileInfoObj = await getFileInfo();
    for (let batchName in fileInfoObj) {
        let fileInfo = fileInfoObj[batchName];
        const cols = fileInfo['cols'];
        if (!cols || !cols.hasOwnProperty("cols.json")) {
            return {};
        }
        const colPath = cols["cols.json"];

        const uploadObj = {} as Record<string, any>;
        uploadObj['colPath'] = colPath;
        uploads[batchName] = uploadObj;
    }

    return uploads;
}

async function getFileInfo() {
    const fileInfoPath = getFileInfoPath();
    const fileInfoExists = await pathExists(fileInfoPath);
    if (!fileInfoExists) {
        return {};
    }

    const fileInfoObj = await getObjFromPath(fileInfoPath);

    return fileInfoObj;
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

export async function uploadFile(uploadInfo: uploadInfo) {
    const batchName = uploadInfo["batchName"];
    try {
        console.log("Upload Info");
        console.log(uploadInfo);

        //@ts-ignore
        const procResult = await handleProcStep(uploadInfo);

        console.log("Process result");
        console.log(procResult);

        const genResult = await handleGenStep(uploadInfo);

        console.log("Generate result");
        console.log(genResult);

        const saveResult = await handleSaveStep(uploadInfo, genResult);

        console.log("Save result");
        console.log(saveResult);

        return successResponse(`Successfully uploaded batch ${batchName}`);

    } catch (error) {
        console.log(error);
        return failResponse(`Failed to upload batch ${batchName}`);
    }
}

async function handleProcStep(uploadInfo: uploadInfo) {

    const handler = handleProcessFile;
    const progKey = "processing";

    return await handleUploadStepGeneric(handler, progKey, uploadInfo);
}

async function handleGenStep(uploadInfo: uploadInfo) {

    const handler = handleGenerate;
    const progKey = "generating";

    return await handleUploadStepGeneric(handler, progKey, uploadInfo);
}

async function handleSaveStep(uploadInfo: uploadInfo, genRes: any) {

    const handler = handleGenSave;
    const progKey = "saving";
    const addArgs = [genRes]

    return await handleUploadStepGeneric(handler, progKey, uploadInfo, addArgs);

}

async function handleUploadStepGeneric(handler: Function, progKey: string, uploadInfo: uploadInfo, addArgs?: Array<any>) {
    let resp;
    if (addArgs === undefined) {
        resp = await handler(uploadInfo);
    } else {
        resp = await handler(...addArgs, uploadInfo);
    }
    throwErrIfFail(resp);

    return resp.response;
}

function getNewProgVal(success: boolean) {
    return success ? "finished" : "fail";
}