import {handleSaveGeneratedGraphs} from "./graphs/graphs";
import {handleSaveGeneratedColumns} from "./graphs/columns";
import {emptyObjAsError, failResponse, successResponse, successResponseAny, throwErrIfFail} from "../responses";
import {getFileInfoPath, fileNameFromPath, getGraphSaveDirPath, getColSaveDirPath} from "../paths";
import {writeObjToPath, getObjFromPath} from "../files";
import {getDataFilePathFromObj, getNewDataFilePathFromObj} from "../keys";
import {mergeObjs} from "../object_helpers";

const SAVE_HANDLERS: any = {
    'genGraphs': handleSaveGeneratedGraphs,
    'genCols': handleSaveGeneratedColumns
}

export type initSaveArgs = {
    dataFilePath: string,
    newDataFilePath: string, 
}
export type saveArgs = {
    dataFilePath: string,
    dataFileName: string, 
    newDataFilePath: string,
    newDataFileName: string,
    graphSaveDir: string, 
    colSaveDir: string,
}

// can probs be key (matching a key above)
    // have separate save function for each? 
export async function handleGenSave(genRes: any, initSaveArgs: initSaveArgs) {
    try {
        // ! want to extract formatting of extra file arguments 
        const saveArgs = addReqSaveArgs(initSaveArgs);
        const savedGraphsObj = await execSaveHandlers(genRes, saveArgs);
        const saveObj = formatSaveJSON(savedGraphsObj, saveArgs);
    
        await addToFileInfo(saveObj);

        return successResponse("Successfully executed post-generation save.");
    } catch (error) {
        return failResponse(error);
    }
}

function addReqSaveArgs(initSaveArgs: initSaveArgs) {

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

    const graphSaveDir = getGraphSaveDirPath(dataFileName);
    const colSaveDir = getColSaveDirPath(dataFileName);

    saveArgs['graphSaveDir'] = graphSaveDir;
    saveArgs['colSaveDir'] = colSaveDir;

    return saveArgs;
}

function formatSaveJSON(existingObj: any, saveArgs: saveArgs) {

    const newDataFilePathResp = getNewDataFilePathFromObj(saveArgs);
    throwErrIfFail(newDataFilePathResp);
    const newDataFilePath = newDataFilePathResp.response; 
    const dataFileName = saveArgs['dataFileName'];

    existingObj['calcFilePath'] = newDataFilePath;
    const saveObj: any = {};
    saveObj[dataFileName] = existingObj;

    console.log("format save json")
    console.log(saveObj);

    return saveObj;
}

async function addToFileInfo(addInfo: any) {
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

        