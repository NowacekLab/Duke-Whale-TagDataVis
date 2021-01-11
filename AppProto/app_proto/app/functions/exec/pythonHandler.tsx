import * as child from 'child_process';

export const path = require('path');
export const isDev = false;

// process.env.NODE_ENV !== 'production';

export const remote = require('electron').remote;
export const SCRIPTS_PATH = isDev ? path.resolve(path.join(__dirname, 'scripts')) : path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
export const fs = window.require('fs');
export const FILES = path.resolve(path.join(SCRIPTS_PATH, 'files'));
export const SCRIPTS_FILES = path.resolve(path.join(FILES, 'scripts_files'));
export const FILES_JSON = path.resolve(path.join(SCRIPTS_FILES, 'files.json'));

export const spawn = require("child_process").spawn; 

export const isWindows = process.platform === "win32";
export const EXEC_PATH = isWindows ? path.resolve(path.join(SCRIPTS_PATH, 'windows_exec', 'main.exe')) :
                            path.resolve(path.join(SCRIPTS_PATH, 'mac_exec', 'main'));
export const python3 = "python3";
export const MAIN_SCRIPT_PATH = path.resolve(path.join(SCRIPTS_PATH, 'main.py'));
export const executor = isDev ? python3 : EXEC_PATH;

// const handleProcess = (process: child.ChildProcess, action: string) => {

export type processHandler = (process: child.ChildProcess) => any;
export default function handlePythonExec(handleProcess: processHandler, handleProcStartError: Function, cmdArgs: Array<any>) {

    console.log("EXECUTOR STARTED");

    const args = isDev ? [MAIN_SCRIPT_PATH, ...cmdArgs] : cmdArgs;

    console.log(executor);

    let pythonProcess; 
    try {
        pythonProcess = spawn(executor, args);
    } catch {
        handleProcStartError();
    }

    handleProcess(pythonProcess);
}