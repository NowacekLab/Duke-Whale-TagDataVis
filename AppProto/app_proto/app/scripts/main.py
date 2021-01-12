"""[Single entrypoint for executable packaging]

PUBLIC MODULES:
    - main
"""

import sys 

from typing import Any, Callable
from private.logs import logDecorator 
from private.actions import actions 
from private.helpers import filesHelper
import settings 

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

@genericLog 
def _createRequiredFiles():
    REQUIRED_FILES = settings.REQUIRED_FILES 
    for requiredFile in REQUIRED_FILES: 
        filesHelper.createFileIfNotExist(requiredFile)
    filesHelper.fillFileIfEmpty()

@genericLog 
def _createRequiredDirs():
    REQUIRED_DIRS = settings.REQUIRED_DIRS
    for requiredDir in REQUIRED_DIRS: 
        filesHelper.createDirIfNotExist(requiredDir)

@genericLog 
def _createRequiredPaths():
    _createRequiredDirs() 
    _createRequiredFiles() 

@genericLog 
def _saveBaseDirPath(cmdArgs: dict):
    if not 'baseDirPath' in cmdArgs: 
        raise Exception("base dir path not given")

    BASE_DIR_PATH = cmdArgs['baseDirPath']

    pass 
    

@genericLog 
def _saveCriticalPaths(cmdArgs: dict):
    _saveBaseDirPath(cmdArgs)

@genericLog 
def _handleRequiredSetup():
    _createRequiredPaths()
        
@genericLog
def _handleCMDArgs():
    if not (len(sys.argv) == 2): 
        raise Exception(f"There must be exactly 2 cmd line args given. Was given {len(sys.argv)} = {' '.join(sys.argv)}. Check conventions.md")

    cmdLineArg = sys.argv[1]
    cmdArgs = _parseCMDLineArg(cmdLineArg)     
    return cmdArgs 


# ! remember, need to finish creating reset.py 

@mainLog
def main() -> Any: 
    cmdArgs = _handleCMDArgs()    
    _handleRequiredSetup()
    return _handleModuleExec(cmdArgs)

@mainLog 
def main_test(testCMDLineArg: str) -> Any: 
    _handleRequiredSetup()
    cmdArgs = _parseCMDLineArg(testCMDLineArg)
    return _handleModuleExec(cmdArgs)

if __name__ == "__main__":    
    print(main())
    sys.stdout.flush()