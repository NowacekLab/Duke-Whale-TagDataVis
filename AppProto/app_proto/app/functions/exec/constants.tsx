export const path = require('path');
export const isDev = process.env.NODE_ENV !== "production";

export const remote = require('electron').remote;
export const SCRIPTS_PATH = isDev ? path.resolve(path.join(__dirname, 'scripts_dev')) : 
                                    path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
export const fs = window.require('fs');
export const spawn = require("child_process").spawn; 

export const isWindows = process.platform === "win32";
export const EXEC_DIR = isWindows ? path.resolve(path.join(SCRIPTS_PATH, 'windows_exec')) :
                                    path.resolve(path.join(SCRIPTS_PATH, 'mac_exec'));
export const python3 = "python3";

// vars 
export const dataFilePathKey = 'dataFilePath';
export const newDataFilePathKey = 'newDataFilePath';
export const loggingFilePathKey = 'loggingFilePath';
export const logFilePathKey = 'logFilePath';
export const gpsFilePathKey = 'gpsFilePath';
export const startLatitudeKey = 'startLatitude';
export const startLongitudeKey = 'startLongitude';