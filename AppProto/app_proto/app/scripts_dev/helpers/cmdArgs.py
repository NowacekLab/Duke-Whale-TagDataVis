import sys 
import logger 
from typing import List 

__KEY_VAL_PAIRS_SEPARATOR = "KEYPAIRSEP"
__KEY_VAL_JOINER = "KEYVALSEP"    
__ARRAY_JOINER = "ARRAYSEP" 

def formatCMDLineArg(cmdArgs: dict):
    argsToJoin = [] 
    for kwarg in cmdArgs: 
        val = cmdArgs[kwarg]
        formatted = f"{kwarg}{__KEY_VAL_JOINER}{val}"
        argsToJoin.append(formatted)
        
    formattedArg = f"{__KEY_VAL_PAIRS_SEPARATOR}".join(argsToJoin)
    
    return formattedArg

def parseCMDLineArg(cmdLineArg: str) -> dict:
    """
    Parses the command line argument 
    """
    if not (type(cmdLineArg) is str): 
        raise Exception("Command Line Argument MUST be a string. Check conventions.md.")

    cmdArgs = {} 
    
    keyValPairs = cmdLineArg.split(__KEY_VAL_PAIRS_SEPARATOR)
    
    for keyValPair in keyValPairs: 
        keyValPairLst = keyValPair.split(__KEY_VAL_JOINER)
        if len(keyValPairLst) == 0: 
            pass 
        elif len(keyValPairLst) == 1: 
            val = "" 
            key = keyValPairLst[0]
        else: 
            key, val = keyValPairLst
        
        cmdArgs[key] = val 
    
    return cmdArgs 

def getCMDLineStr() -> str: 
    if not len(sys.argv) == 2: 
        raise Exception(f"There must be exactly 2 cmd line args given. Was given {len(sys.argv)} = {' '.join(sys.argv)}. Check conventions.md")

    cmdLineStr = sys.argv[1]
        
    return cmdLineStr

def getCMDLineArgs() -> dict:
    cmdLineStr = getCMDLineStr() 
    cmdLineArgs = parseCMDLineArg(cmdLineStr)
    
    # if required:
    #     for kwarg in required: 
    #         if required not in cmdLineArgs:
    #             raise Exception(f"Required kwarg {kwarg} not given.")

    return cmdLineArgs

def getArray(val: str) -> List[str]:
    return val.split(__ARRAY_JOINER)