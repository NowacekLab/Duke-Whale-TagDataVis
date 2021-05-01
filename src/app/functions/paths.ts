import {isWindows, isDev} from "./constants";
import {getLoggingFilePathKey} from "./keys";
import {createDirIfNotExist} from "./files";
import { createReducer } from "@reduxjs/toolkit";

//@ts-ignore
export const path = require('path');
//@ts-ignore
export const remote = require('electron').remote;
const BASE_DIR_PATH = remote.app.getAppPath();
const LOGS_DIR_PATH = remote.app.getPath('logs');
const USER_DATA_DIR_PATH = remote.app.getPath('userData');

export function addToPath(origPath: string, add: string) {
    const newPath = path.resolve(path.join(origPath, add));
    return newPath; 
}

const appFileDirName = 'app_files';
const appFileParentDir = BASE_DIR_PATH;
const errorLogFileName = "errors.log";
const errorLogFileParentDir = BASE_DIR_PATH;
const savesDirName = 'save_files';
const savesParentDir = USER_DATA_DIR_PATH;
const distParentDir = BASE_DIR_PATH;
const APP_FILES_PATH = addToPath(appFileParentDir, appFileDirName);
const ERROR_LOG_FILE_PATH = addToPath(errorLogFileParentDir, errorLogFileName);
const SAVES_DIR_PATH = addToPath(savesParentDir, savesDirName);

const DIST_DIR_PATH = addToPath(distParentDir, 'dist');
const DUKE_IMG_PATH = addToPath(DIST_DIR_PATH, 'duke.png');

const FILE_INFO_PATH = addToPath(SAVES_DIR_PATH, 'file_info.json');
const SETTINGS_FILE_PATH = addToPath(SAVES_DIR_PATH, 'settings.json');

const scriptsDevName = 'scripts_dev';
const scriptsProdName = 'scripts';
const scriptsParentDir = BASE_DIR_PATH;
const SCRIPTS_DEV_PATH = addToPath(scriptsParentDir, scriptsDevName);
const SCRIPTS_PROD_PATH = addToPath(scriptsParentDir, scriptsProdName);
const SCRIPTS_PATH = isDev ? SCRIPTS_DEV_PATH : SCRIPTS_PROD_PATH;

const winExecDirName = "windows_exec";
const macExecDirName = "mac_exec";
const execParentDir = SCRIPTS_PATH;
const WINDOWS_EXEC_PATH = addToPath(execParentDir, winExecDirName);
const MAC_EXEC_PATH = addToPath(execParentDir, macExecDirName);
const EXEC_DIR_PATH = isWindows ? WINDOWS_EXEC_PATH : MAC_EXEC_PATH;

export function getBaseDirPath() {
    return BASE_DIR_PATH;
}

export function getAppFilesPath() {
    return APP_FILES_PATH; 
}

export function getLogDirPath() {
    return LOGS_DIR_PATH;
}

export function getLoggingErrorFilePath() {
    return ERROR_LOG_FILE_PATH;
}

export function getUserDataDirPath() {
    return USER_DATA_DIR_PATH;
}

export function getSaveDirPath() {
    return SAVES_DIR_PATH;
}

export function getScriptsPath() {
    return SCRIPTS_PATH;
}

export function getExecDirPath() {
    return EXEC_DIR_PATH;
}


export function getDistDirPath() {
    return DIST_DIR_PATH;
}

export function getDukeImgPath() {
    return DUKE_IMG_PATH;
}

export function getFileInfoPath() {
    return FILE_INFO_PATH;
}

export function getSettingsFilePath() {
    return SETTINGS_FILE_PATH;
}


// TODO: the below is hard-coded, where dev/prod/args_path all know each other's dirs. 
    // Can refactor this. 
export function getPythonArgsPath(pythonScriptName: string) {

    const directory = isDev ? SCRIPTS_PATH : getProdPythonScriptDirPath(pythonScriptName);

    return path.resolve(path.join(directory, "python.json"));
}

export function getDevPythonScriptPath(pythonScriptName: string) {
    const devPythonScriptPath = path.resolve(path.join(SCRIPTS_PATH, pythonScriptName));
    return devPythonScriptPath; 
}

export function getProdPythonScriptDirPath(pythonScriptName: string) {
    return path.resolve(path.join(EXEC_DIR_PATH, pythonScriptName));
}

export function getProdPythonScriptPath(pythonScriptName: string) {
    const prodPythonScriptDirPath = getProdPythonScriptDirPath(pythonScriptName);

    // it is usually mac or win_exec/script_name/script_name
    const prodPythonScriptPath = path.resolve(path.join(prodPythonScriptDirPath, pythonScriptName));
    return prodPythonScriptPath;
}

export function addLoggingErrorFilePath(args: any) {
    const argsCopy = Object.assign(args);
    const loggingfilePathKey = getLoggingFilePathKey();
    argsCopy[loggingfilePathKey] = getLoggingErrorFilePath();
    return argsCopy; 
}

export function fileNameFromPath(filePath: string) {
    const baseFileName = path.basename(filePath);
    return baseFileName;
}

export async function getGraphSaveDirPath(batchFileName: string) {
    return getAndCreateSaveDirPathGeneric(batchFileName);
}

export async function getColSaveDirPath(batchFileName: string) {
    return getAndCreateSaveDirPathGeneric(batchFileName);
}

export async function getBatchSaveDir(batchFileName: string) {
    const saveDirPath = getSaveDirPath();
    const newDirPath = addToPath(saveDirPath, batchFileName);
    return newDirPath;
}

export async function getAndCreateSaveDirPathGeneric(batchFileName: string) {
    const saveDirPath = getSaveDirPath();
    await createDirIfNotExist(saveDirPath)
    const newDirPath = addToPath(saveDirPath, batchFileName);
    await createDirIfNotExist(newDirPath);
    return newDirPath;
}

export async function getNewDataFilePath(batchName: string, dataFileName: string) {
    const dir = await getAndCreateSaveDirPathGeneric(batchName);
    let baseFileName = dataFileName;
    if (dataFileName.endsWith(".mat") || dataFileName.endsWith(".csv")) {
        baseFileName = baseFileName.replace(".mat", "");
        baseFileName = baseFileName.replace(".csv", "");
    }

    const newDataFileName = baseFileName + "calcs.csv";
    const newPath = path.resolve(path.join(dir, newDataFileName));
    return newPath;
}