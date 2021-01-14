import {isDev, EXEC_DIR, 
        python3, path, 
        SCRIPTS_PATH, dataFilePathKey,
        newDataFilePathKey, loggingFilePathKey,
        logFilePathKey, gpsFilePathKey, startLatitudeKey,
        startLongitudeKey} from "../exec/constants";
import handlePythonExec from "../exec/python_exec";
import {formatCMDLineArgs} from "../exec/helpers";

export type cmdLineArgs = Record<string, string>;
export async function processGeneric(pythonScriptName: string, scriptName: string, cmdLineArgs: cmdLineArgs) {

    const cmdLineString = formatCMDLineArgs(cmdLineArgs);
    const pythonScriptPath = path.resolve(path.join(SCRIPTS_PATH, pythonScriptName));
    const scriptDir = path.resolve(path.join(EXEC_DIR, scriptName));
    const scriptPath = path.resolve(path.join(scriptDir, scriptName));
    const executor = isDev ? python3 : scriptPath;

    const args = isDev ? [pythonScriptPath, cmdLineString] : [cmdLineString];

    const res = await handlePythonExec(executor, args);
    const responseObj = res ?? {success: false, response: "handlePythonExec() did not return valid response object"};

    return responseObj;
}

export type processFileKey = string;
export const processFileKeys: Array<processFileKey> = [dataFilePathKey, newDataFilePathKey,
                                loggingFilePathKey, logFilePathKey,
                                gpsFilePathKey, startLatitudeKey,
                                startLongitudeKey]
export type processFileCMDLineArgs = Record<processFileKey, string>;

async function processFile(cmdLineArgs: processFileCMDLineArgs) {
    const pythonScriptName = "process.py";
    const scriptName = "process";

    const processResp = await processGeneric(pythonScriptName, scriptName, cmdLineArgs);

    return processResp;
}

export function getProcessFileArgs(args: processFileCMDLineArgs) {

    const processFileArgs = {} as processFileCMDLineArgs;

    for (const processFileKey of processFileKeys) {
        if (!args.hasOwnProperty(processFileKey)) {
            throw Error("Given arguments @getProcessFileArgs does not contain all required keys.");
        }
        const val = args[processFileKey];
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
        const processResp = processFile(processFileArgs);
        return processResp;
    } catch (error) {
        return {
            success: false,
            response: error,
        }
    }

}

const manualTestsDir = path.resolve(path.join(SCRIPTS_PATH, 'manualTests'));
const testFilesDir = path.resolve(path.join(manualTestsDir, 'testFiles'));
const batch1dir = path.resolve(path.join(testFilesDir, 'batch1'));
const newbatch1dir = path.resolve(path.join(batch1dir, 'new'));
const cmdArgsTest = {
    dataFilePath: path.resolve(path.join(batch1dir, 'DATA_gm12_172aprh.mat')),
    newDataFilePath: path.resolve(path.join(newbatch1dir, 'DATA_gm12_172aprh_precalcs.csv')),
    loggingFilePath: path.resolve(path.join(newbatch1dir, 'errors.log')),
    logFilePath: path.resolve(path.join(batch1dir, "LOG_gm172alog.txt")),
    gpsFilePath: path.resolve(path.join(batch1dir, 'GPS_20120620_Exocetus_Focal_Follow_Gm_12_172a.xlsx')),
    startLatitude: "35.87998",
    startLongitude: "74.84635"
}
const handle = (resp:any) => {console.log(resp)};
export const processTest = () => {
    return processFile(cmdArgsTest);
}