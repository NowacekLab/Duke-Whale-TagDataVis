import {handleProcessFile} from "../exec/process";
import {throwErrIfFail, failResponse, successResponse} from "../responses";
import {handleGenerate} from "../exec/generate";
import {handleGenSave} from "../exec/save";
import {uploadFinishedObjects, uploadFinishedObj, uploadInfo} from "../uploads/uploadsTypes";
import {getFileInfoPath, getSaveDirPath} from "../paths";
import {pathExists, getObjFromPath, createDirIfNotExist, createPathIfNotExist} from "../files";

export async function loadFileInfoArr() {
    const fileInfoPath = getFileInfoPath();
    const fileInfoExists = await pathExists(fileInfoPath);
    if (!fileInfoExists) {
        return {};
    }

    const fileInfoObj = await getObjFromPath(fileInfoPath);
    const arr = [];

    for (let batchName in fileInfoObj) {

        const fileInfo = fileInfoObj[batchName];
        arr.push(fileInfo);
    }       

    return arr;
}

function getUploadInfoArr(uploadInfo: uploadInfo) {

    const ISOStartingDate = uploadInfo['startingDate'];
    const dateObj = new Date(ISOStartingDate);
    const startingDate = dateObj ?? ISOStartingDate;

    const DataOrNA = (data: string) => {
        let realData = data ?? "";
        return realData === "" ? "Not Available" : data;
    }

    const uploadInfoArr = [
        {
            title: "Data File Name",
            info: DataOrNA(uploadInfo["dataFileName"])
        },
        {   
            title: "Starting Date",
            info: `${startingDate}`,
        },
        {
            title: "GPS File Name",
            info: DataOrNA(uploadInfo["gpsFileName"])
        },
        {
            title: "Starting Latitude and Longitude",
            info: `Lat: (${DataOrNA(uploadInfo["startLatitude"])}), Long: (${DataOrNA(uploadInfo["startLongitude"])})`
        }
    ];

    return uploadInfoArr; 
}

export async function loadFinishedUploads() {

    const fileInfoObj = await getFileInfo();
    const finishedUploads = {} as uploadFinishedObjects;

    for (let batchName in fileInfoObj) {

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

    console.log(uploadInfo);

    const batchName = uploadInfo["batchName"];
    try {
        await createPreRequFileAndDirs();

        //@ts-ignore
        const procResult = await handleProcStep(uploadInfo);
        const genResult = await handleGenStep(uploadInfo);
        const saveResult = await handleSaveStep(uploadInfo, genResult);

        return successResponse(`Successfully uploaded batch ${batchName}`);

    } catch (error) {
        return failResponse(`Failed to upload batch ${batchName}`);
    }
}

async function createPreRequFileAndDirs() {
    const saveDir = getSaveDirPath();
    await createDirIfNotExist(saveDir);
    const savePath = getFileInfoPath();
    await createPathIfNotExist(savePath);
}

async function handleProcStep(uploadInfo: uploadInfo) {

    const handler = handleProcessFile;

    return await handleUploadStepGeneric(handler, uploadInfo);
}

async function handleGenStep(uploadInfo: uploadInfo) {

    const handler = handleGenerate;

    return await handleUploadStepGeneric(handler, uploadInfo);
}

async function handleSaveStep(uploadInfo: uploadInfo, genRes: any) {

    const handler = handleGenSave;
    const addArgs = [genRes]

    return await handleUploadStepGeneric(handler, uploadInfo, addArgs);

}

async function handleUploadStepGeneric(handler: Function, uploadInfo: uploadInfo, addArgs?: Array<any>) {
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