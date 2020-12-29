    """[Single entrypoint for executable packaging]

    PUBLIC MODULES:
        - main
    """

import sys 

from typing import Any, Callable
from private.logs import logDecorator 
from private.actions import actions 

MODULE_NAME = "main.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

__MODULES = {
    "actions": actions.main, 
}

@genericLog
def __parseCMDLineArg(cmdLineArg: str) -> dict:
    """
    Parses the command line argument 
    """
    if not (type(cmdLineArg) is str): 
        raise Exception("Command Line Argument MUST be a string. Check conventions.md.")

    cmdArgs = {} 

    keyValPairs = cmdLineArg.split("-")
    for keyValPair in keyValPairs: 
        key, val = keyValPair.split(":")
        cmdArgs[key] = val 
    
    return cmdArgs 

@genericLog
def __getModule(cmdArgs: dict) -> Callable: 
    
    # ! hard coded 
    if not "moduleName" in cmdArgs: 
        raise Exception("`moduleName` key missing in command line argument string.")
    
    moduleName = cmdArgs['moduleName']

    module = __MODULES[moduleName]
    
    return module 

@genericLog
def __handleModuleExec(cmdArgs: dict) -> Any:
    """
    Executes appropriate module 
    """

    moduleExec = __getModule(cmdArgs) 
    
    return moduleExec() 

@genericLog
def main() -> Any: 
    if not (len(sys.argv) == 2): 
        raise Exception(f"There must be exactly 2 cmd line args given. Was given {len(sys.argv)}. Check conventions.md")

    cmdLineArg = sys.argv[1]
    cmdArgs = __parseCMDLineArg(cmdLineArg) 
    
    return __handleModuleExec(cmdArgs)

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()
    # print('hi')

    # python3 main.py csvmat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm14_279aprh.mat gm14_279aprh.mat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm279alog.txt gm279alog.txt /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/20141006_Barber_Focal_Follow_Gm_14_279a.xlsx 20141006_Barber_Focal_Follow_Gm_14_279a.xlsx

    # ./main/main csvmat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm14_279aprh.mat gm14_279aprh.mat /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/test_files/gm279alog.txt gm279alog.txt 
