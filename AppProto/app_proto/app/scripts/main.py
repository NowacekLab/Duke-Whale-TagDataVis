"""[Single entrypoint for executable packaging]

PUBLIC MODULES:
    - main
"""

import sys 

from typing import Any, Callable
from private.logs import logDecorator 
from private.actions import actions 
import multiprocessing 

MODULE_NAME = "main.py"
genericLog = logDecorator.genericLog(MODULE_NAME)
mainLog = logDecorator.mainLog(MODULE_NAME)

__MODULES = {
    "actions": actions.handleAction, 
}

@genericLog
def _parseCMDLineArg(cmdLineArg: str) -> dict:
    """
    Parses the command line argument 
    """
    if not (type(cmdLineArg) is str): 
        raise Exception("Command Line Argument MUST be a string. Check conventions.md.")

    cmdArgs = {} 

    keyValPairs = cmdLineArg.split(";-;")
    for keyValPair in keyValPairs: 
        keyValPairLst = keyValPair.split(":")
        if len(keyValPairLst) == 0: 
            pass 
        elif len(keyValPairLst) == 1: 
            val = "" 
            key = keyValPairLst[0]
        else: 
            key, val = keyValPairLst
        
        cmdArgs[key] = val 
    
    return cmdArgs 

@genericLog
def _getModule(cmdArgs: dict) -> Callable: 
    
    # ! hard coded 
    if not "moduleName" in cmdArgs: 
        raise Exception("`moduleName` key missing in command line argument string.")
    
    moduleName = cmdArgs['moduleName']

    module = __MODULES[moduleName]
    
    return module 

@genericLog
def _handleModuleExec(cmdArgs: dict) -> Any:
    """
    Executes appropriate module 
    """

    moduleExec = _getModule(cmdArgs) 
    
    return moduleExec(cmdArgs) 

@mainLog
def main() -> Any: 
    if not (len(sys.argv) == 2): 
        raise Exception(f"There must be exactly 2 cmd line args given. Was given {len(sys.argv)} = {' '.join(sys.argv)}. Check conventions.md")

    cmdLineArg = sys.argv[1]
    cmdArgs = _parseCMDLineArg(cmdLineArg) 
    
    return _handleModuleExec(cmdArgs)

    # ! remember to create a central path creator near the start of the application
        # ! all in 'files' dir 
        
@mainLog 
def main_test(testCMDLineArg: str) -> Any: 
    
    cmdArgs = _parseCMDLineArg(testCMDLineArg)
    return _handleModuleExec(cmdArgs)

if __name__ == "__main__":
    
    multiprocessing.freeze_support()
    
    print(main())
    sys.stdout.flush()
    # print('hi')

    # python3 main.py csvmat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm14_279aprh.mat gm14_279aprh.mat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm279alog.txt gm279alog.txt /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/20141006_Barber_Focal_Follow_Gm_14_279a.xlsx 20141006_Barber_Focal_Follow_Gm_14_279a.xlsx

    # ./main/main csvmat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm14_279aprh.mat gm14_279aprh.mat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm279alog.txt gm279alog.txt 
