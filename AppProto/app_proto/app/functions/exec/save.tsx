import {handleSaveGeneratedGraphs} from "./graphs/graphs";
import {handleSaveGeneratedColumns} from "./graphs/columns";
import {emptyObjAsError, failResponse, successResponse, successResponseAny, throwErrIfFail} from "../responses";
import {getFileInfoPath, fileNameFromPath, getGraphSaveDirPath, getColSaveDirPath, getSaveDirPath} from "../paths";
import {writeObjToPath, getObjFromPath, createDirIfNotExist, createPathIfNotExist} from "../files";
import {getDataFilePathFromObj, getNewDataFilePathFromObj} from "../keys";
import {mergeObjs} from "../object_helpers";
import {uploadInfo} from "../uploads/uploadsTypes";

const SAVE_HANDLERS: any = {
    'genGraphs': handleSaveGeneratedGraphs,
    'genCols': handleSaveGeneratedColumns
}

export type initSaveArgs = {
    dataFilePath: string, 
    newDataFilePath: string,
    loggingFilePath: string, 
    logFilePath: string,
    gpsFilePath: string, 
    startLatitude: string, 
    startLongitude: string, 
}
export type saveArgs = {
    dataFilePath: string,
    dataFileName: string, 
    newDataFilePath: string,
    newDataFileName: string,
    logFilePath: string,
    gpsFilePath: string,
    startLatitude: string, 
    startLongitude: string,
    graphSaveDir: string, 
    colSaveDir: string,
}

// can probs be key (matching a key above)
    // have separate save function for each? 
export async function handleGenSave(genRes: any, uploadInfo: uploadInfo, initSaveArgs: initSaveArgs) {
    try {
        // ! want to extract formatting of extra file arguments 
        const saveArgs = addReqSaveArgs(initSaveArgs, uploadInfo);
        const savedGraphsObj = await execSaveHandlers(genRes, saveArgs);
        const saveObj = formatSaveJSON(savedGraphsObj, uploadInfo, saveArgs);
    
        await addToFileInfo(saveObj);

        console.log("Handle gen past saving")

        return successResponse("Successfully executed post-generation save.");
    } catch (error) {

        console.log("Handle gen save error")
        console.log(error)

        return failResponse(error);
    }
}

function addReqSaveArgs(initSaveArgs: initSaveArgs, uploadInfo: uploadInfo) {

    const saveArgs = Object.assign(initSaveArgs);

    const dataFilePathResp = getDataFilePathFromObj(initSaveArgs);
    throwErrIfFail(dataFilePathResp);
    const dataFilePath = dataFilePathResp.response;
    const dataFileName = fileNameFromPath(dataFilePath);

    const newDataFilePathResp = getNewDataFilePathFromObj(initSaveArgs);
    throwErrIfFail(newDataFilePathResp);
    const newDataFilePath = newDataFilePathResp.response; 
    const newDataFileName = fileNameFromPath(newDataFilePath);

    saveArgs['dataFileName'] = dataFileName;
    saveArgs['newDataFileName'] = newDataFileName; 

    const batchName = uploadInfo["batchName"];
    const graphSaveDir = getGraphSaveDirPath(batchName);
    const colSaveDir = getColSaveDirPath(batchName);

    saveArgs['graphSaveDir'] = graphSaveDir;
    saveArgs['colSaveDir'] = colSaveDir;

    return saveArgs;
}

function formatSaveJSON(existingObj: any, uploadInfo: uploadInfo, saveArgs: saveArgs) {

    const newDataFilePathResp = getNewDataFilePathFromObj(saveArgs);
    throwErrIfFail(newDataFilePathResp);
    const newDataFilePath = newDataFilePathResp.response; 
    const dataFileName = saveArgs['dataFileName'];
    const logFileName = fileNameFromPath(saveArgs['logFilePath']);
    const gpsFileName = fileNameFromPath(saveArgs['gpsFilePath']);

    existingObj['calcFilePath'] = newDataFilePath;



    const batchInfo = {
        batchName: uploadInfo["batchName"],
        batchInfo: {
            dataFilePath: saveArgs["dataFilePath"],
            dataFileName: dataFileName,
            logFilePath: saveArgs["logFilePath"],
            logFileName: logFileName,
            gpsFilePath: saveArgs["gpsFilePath"],
            gpsFileName: gpsFileName,
            startLatitude: saveArgs["startLatitude"],
            startLongitude: saveArgs["startLongitude"]
        }
    }
    existingObj["uploadInfo"] = batchInfo;

    const saveObj: any = {};

    const batchName = uploadInfo["batchName"];
    saveObj[batchName] = existingObj;

    console.log("format save json")
    console.log(saveObj);

    return saveObj;
}

async function addToFileInfo(addInfo: any) {
    await createFileInfoIfNotExist();
    const existingFileInfo = await getFileInfo();
    const mergedInfo = mergeObjs(existingFileInfo, addInfo);
    await saveFileInfo(mergedInfo);
}

async function getFileInfo() {
    const savePath = getFileInfoPath();
    return await getObjFromPath(savePath);
}

async function saveFileInfo(saveObj: any) {
    const savePath = getFileInfoPath();
    return await writeObjToPath(savePath, saveObj);
}

async function createFileInfoIfNotExist() {

    console.log("CREATE DIR IF NOT EXIST")

    const saveDir = getSaveDirPath();
    console.log(saveDir);
    await createDirIfNotExist(saveDir);

    console.log("CREATE PATH IF NOT EXIST")
    const savePath = getFileInfoPath();
    console.log(savePath);
    await createPathIfNotExist(savePath);
}

async function execSaveHandlers(genRes: any, saveArgs: saveArgs) {
    const savedObjs: any = {};

    for (let saveType in SAVE_HANDLERS) {
        const saveHandler = SAVE_HANDLERS[saveType];

        try {
            const genResForType = genRes[saveType];
            const {success, response} = await saveHandler(genResForType, saveArgs);

            if (success) {
                savedObjs[saveType] = response;
            }

        } catch (error) {
        }    
    }

    verifySaveHandlersSuccess(savedObjs);

    return savedObjs;
}

function verifySaveHandlersSuccess(savedObjs: any) {

    try {   
        emptyObjAsError(savedObjs, savedObjs, "No paths were successfully saved.");
        
        for (let saveType in SAVE_HANDLERS) {

            const saveTypeErrorMsg = `Save type ${saveType} could not be saved.`

            if (!(savedObjs.hasOwnProperty(saveType))) {
                throw Error(saveTypeErrorMsg);
            }

            const savedObj = savedObjs[saveType];

            emptyObjAsError(savedObj, savedObj, saveTypeErrorMsg);
        }

        return successResponseAny(savedObjs);
    } catch (error) {
        return failResponse(error);
    }

}



/** 
 * handleSaveGeneratedGraphs
 * - needs to be saved to graphing path with datafilename
 *  - could consider a save file directory instead for graphs and columns 
 * handleSaveGeneratedColumns
 * - can save both with their given names
 *  - e.g. cols.json, graphnames.json
 * 
 * - although ugly, can pass in graph args into the functions 
 */

        