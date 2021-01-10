import * as child from 'child_process';

const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const remote = require('electron').remote;
const SCRIPTS_PATH = isDev ? path.resolve(path.join(__dirname, 'scripts')) : path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
const spawn = require("child_process").spawn; 

const isWindows = process.platform === "win32";
const EXEC_PATH = isWindows ? path.resolve(path.join(SCRIPTS_PATH, 'windows_exec', 'main.exe')) :
                            path.resolve(path.join(SCRIPTS_PATH, 'mac_exec', 'main'));
const python3 = "python3";
const MAIN_SCRIPT_PATH = path.resolve(path.join(SCRIPTS_PATH, 'main.py'));
const executor = isDev ? python3 : EXEC_PATH;

// const handleProcess = (process: child.ChildProcess, action: string) => {

export type processHandler = (process: child.ChildProcess) => any;
export default function handlePythonExec(handleProcess: processHandler, handleProcStartError: Function, cmdArgs: Array<any>) {

    const args = isDev ? [MAIN_SCRIPT_PATH, ...cmdArgs] : cmdArgs;

    let pythonProcess; 
    try {
        pythonProcess = spawn(executor, args);
    } catch {
        handleProcStartError();
    }

    handleProcess(pythonProcess);
}