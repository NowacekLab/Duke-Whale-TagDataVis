import {isDev, python3, isWindows} from "../constants";
import handlePythonExec from "../exec/python_exec";
import {formatCMDLineArgs} from "./cmdArgs";
import {getDevPythonScriptPath, getProdPythonScriptPath, addLoggingErrorFilePath} from "../paths";
import {failResponse, successResponse, throwErrIfFail} from "../responses"
import {getDataFilePathKey, getNewDataFilePathKey,
        getLoggingFilePathKey,
        getGPSFilePathKey, getStartLatitudeKey, getStartLongitudeKey} from "../keys";

export type cmdLineArgs = any;
export async function processGeneric(pythonScriptName: string, scriptName: string, cmdLineArgs: cmdLineArgs) {

    cmdLineArgs['scriptName'] = scriptName;

    // Windows treats """" differently than Mac (Mac will include "" in string at python end, Windows will not, so pad with Z to treat the same)
    const cmdLineString = isWindows ? `Z${formatCMDLineArgs(cmdLineArgs)}Z`: `"${formatCMDLineArgs(cmdLineArgs)}"`;

    const devPythonScriptPath = getDevPythonScriptPath("main.py");
    const prodPythonScriptPath = getProdPythonScriptPath("main");
    const executor = isDev ? python3 : prodPythonScriptPath;
    const args = isDev ? [devPythonScriptPath, cmdLineString] : [cmdLineString];
    const res = await handlePythonExec(executor, args).catch((err) => {
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

        return processResp;
    } catch (error) {

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

        return exportResp;
    } catch (error) {

        return failResponse(error);
    }
}

export interface videoFileCMDLineArgs {
    [index: string]: string,
    calcFilePath: string,
    newFilePath: string,
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
        throwErrIfFail(exportResp);

        return successResponse("Successfully processed video file action.");
    } catch (error) {
        return failResponse(error);
    }
}

export interface mahalPOICMDArgs {
    [index: string]: string,
    calcFilePath: string,
    newFilePath: string,
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
        throwErrIfFail(exportResp);

        return successResponse("Successfully processed mahal poi action.");
    } catch (error) {
        return failResponse(error);
    }
}

export interface exportHTMLCMDLineArgs {
    [index: string]: string,
    graphFilePath: string,
    newFilePath: string,
}

async function exportHTML(cmdLineArgs: exportHTMLCMDLineArgs) {
    const pythonScriptName = 'export_html.py';
    const scriptName = 'export_html';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);
    
    return processResp;
}

export async function handleExportHTML(args: exportHTMLCMDLineArgs) {
    try {
        const exportResp = await exportHTML(args);
        throwErrIfFail(exportResp);

        return successResponse("Successfully finished export HTML.");
    } catch (error) {
        return failResponse(error);
    }
}

export interface waveletsCMDLineArgs {
    [index: string]: string,
    calcFilePath: string,
    newFilePathOne: string,
    newFilePathTwo: string,
    isExportOne: string,
    isExportTwo: string,
    variable: string,
    depthLimit: string,
    colorByVar: string,
    showLevels: string,
}

export interface wavesParams {
    [index: string]: any,
    variable: string,
    depthLimit: string,
    colorByVar: string,
    showLevels: string,
}

async function processWavelets(cmdLineArgs: waveletsCMDLineArgs) {
    const pythonScriptName = 'wavelets.py';
    const scriptName = 'wavelets';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);
    
    return processResp;
}

export async function handleProcessWavelets(args: waveletsCMDLineArgs) {
    try {
        const exportResp = await processWavelets(args);
        throwErrIfFail(exportResp);

        return successResponse("Successfully processed wavelets.");
    } catch (error) {
        return failResponse(error);
    }
}

export interface divesCMDLineArgs {
    [index: string]: string,
    calcFilePath: string,
    newFilePath: string,
    isExport: string,
    minLength: string,
    requiredDepth: string,
    maxDepth: string,
    interestVars: string,
}

export interface divesParams {
    [index: string]: any,
    minLength: string,
    requiredDepth: string,
    maxDepth: string,
}

async function processDives(cmdLineArgs: divesCMDLineArgs) {
    const pythonScriptName = 'dives.py';
    const scriptName = 'dives';

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);
    
    return processResp;
}

export async function handleProcessDives(args: divesCMDLineArgs) {
    try {
        const exportResp = await processDives(args);
        throwErrIfFail(exportResp);

        return successResponse("Successfully processed dives.");
    } catch (error) {
        return failResponse(error);
    }
}