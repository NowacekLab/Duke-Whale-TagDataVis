import {isDev, python3} from "../constants";
import handlePythonExec from "../exec/python_exec";
import {formatCMDLineArgs} from "./cmdArgs";
import {getDevPythonScriptPath, getProdPythonScriptPath, addLoggingErrorFilePath} from "../paths";
import {failResponse, successResponse, throwErrIfFail} from "../responses"
import {getDataFilePathKey, getNewDataFilePathKey,
        getLoggingFilePathKey,
        getGPSFilePathKey, getStartLatitudeKey, getStartLongitudeKey} from "../keys";

export type cmdLineArgs = any;
export async function processGeneric(pythonScriptName: string, scriptName: string, cmdLineArgs: cmdLineArgs) {

    const cmdLineString = formatCMDLineArgs(cmdLineArgs);
    const devPythonScriptPath = getDevPythonScriptPath(pythonScriptName);
    const prodPythonScriptPath = getProdPythonScriptPath(scriptName);
    const executor = isDev ? python3 : prodPythonScriptPath;
    const args = isDev ? [devPythonScriptPath, cmdLineString] : [cmdLineString];

    console.log("PROCESS GENERIC")
    console.log(python3);
    console.log(isDev);
    console.log(`EXECUTOR: ${executor}`)

    const res = await handlePythonExec(executor, args).catch((err) => {
        console.log("PYTHON EXEC ERROR");
        console.log(python3);
        console.log(isDev);
        console.log(err);
        return {
            success: false,
            response: err 
        }
    });
    const responseObj = res ?? {success: false, response: "handlePythonExec() did not return valid response object"};

    return responseObj;
}

const dataFilePathKey = getDataFilePathKey();
const newDataFilePathKey = getNewDataFilePathKey();
const loggingFilePathKey = getLoggingFilePathKey();
const startingDateKey = 'startingDate';
const gpsFilePathKey = getGPSFilePathKey();
const startLatitudeKey = getStartLatitudeKey();
const startLongitudeKey = getStartLongitudeKey();

export type processFileKey = string;
export const processFileKeys: Array<processFileKey> = ["batchName", dataFilePathKey, newDataFilePathKey,
                                loggingFilePathKey, startingDateKey,
                                gpsFilePathKey, startLatitudeKey,
                                startLongitudeKey]
interface processFileCMDLineArgs {
    [index: string] : string, 
    batchName: string,
    dataFilePathKey: string, 
    newDataFilePathKey: string, 
    loggingFilePathKey: string, 
    startingDateKey: string, 
    gpsFilePathKey: string, 
    startLatitudeKey: string, 
    startLongitudeKey: string
}

async function processFile(cmdLineArgs: processFileCMDLineArgs) {
    const pythonScriptName = "process.py";
    const scriptName = "process";

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);

    return processResp;
}

export function getProcessFileArgs(args: processFileCMDLineArgs) {

    const modArgs = addLoggingErrorFilePath(args);

    const processFileArgs = {} as processFileCMDLineArgs;

    for (const processFileKey of processFileKeys) {
        if (!modArgs.hasOwnProperty(processFileKey)) {
            throw Error("Given arguments @getProcessFileArgs does not contain all required keys.");
        }
        const val = modArgs[processFileKey];
        processFileArgs[processFileKey] = val;
    }

    return processFileArgs;
    
}

export async function handleProcessFile(args: processFileCMDLineArgs) {
    /**
     * Gets the required key:val pairs from args and begins processing
     * 
     * @param args The object with key:val properties
     */

    try {
        const processFileArgs = getProcessFileArgs(args);
        const processResp = await processFile(processFileArgs);

        console.log("HANDLE PROCESS FILE RESPONSE")
        console.log(processResp)

        return processResp;
    } catch (error) {

        console.log("HANDLE PROCESS FILE ERROR");
        console.log(error);

        return failResponse(error);
    }

}

export interface exportCMDLineArgs {
    [index: string]: string,
    filePaths: string, 
    targetDirectory: string,
    exportType: string, 
    loggingFilePath: string, 
}

async function exportFile(cmdLineArgs: exportCMDLineArgs) {
    const pythonScriptName = 'export.py';
    const scriptName = 'export';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);

    return processResp;
}

export async function handleExportFile(args: exportCMDLineArgs) {
    try {
        const exportResp = await exportFile(args);

        console.log("HANDLE EXPORT FILE RESPONSE");
        console.log(exportResp);

        return exportResp;
    } catch (error) {

        console.log("HANDLE EXPORT FILE ERROR");
        console.log(error);

        return failResponse(error);
    }
}

export interface videoFileCMDLineArgs {
    [index: string]: string,
    calcFilePath: string,
    newFileName: string,
    targetDirectory: string,
    isExport: string,
}

async function runVideoFileProcess(cmdLineArgs: videoFileCMDLineArgs) {
    const pythonScriptName = 'export_video.py';
    const scriptName = 'export_video';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);
    
    return processResp;
}

export async function handleProcessVideoFile(args: videoFileCMDLineArgs) {
    try {
        const exportResp = await runVideoFileProcess(args);

        console.log("HANDLE PROCESS VIDEO FILE RESPONSE");
        console.log(exportResp); 

        throwErrIfFail(exportResp);

        return successResponse("Successfully processed video file action.");
    } catch (error) {

        console.log("HANDLE PROCESS VIDEO FILE ERROR");
        console.log(error);

        return failResponse(error);
    }
}

export interface mahalPOICMDArgs {
    [index: string]: string,
    calcFilePath: string,
    newFileName: string,
    targetDirectory: string,
    isExport: string,
    variableOne: string,
    variableTwo: string,
    variableThree: string,
    pLimit: string,
    windowSize: string,
    groupSize: string,
    depthLimit: string 
}

export interface mahalPOIParams {
    [index: string]: any,
    pLimit: string,
    windowSize: string,
    groupSize: string,
    depthLimit: string 
}

async function runMahalPOIProcess(cmdLineArgs: mahalPOICMDArgs) {
    const pythonScriptName = 'mahalanobis.py';
    const scriptName = 'mahalanobis';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);
    
    return processResp;
}

export async function handleProcessMahalPOI(args: mahalPOICMDArgs) {
    try {
        const exportResp = await runMahalPOIProcess(args);

        console.log("HANDLE PROCESS MAHAL POI RESPONSE");
        console.log(exportResp); 

        throwErrIfFail(exportResp);

        return successResponse("Successfully processed mahal poi action.");
    } catch (error) {

        console.log("HANDLE PROCESS MAHAL POI ERROR");
        console.log(error);

        return failResponse(error);
    }
}