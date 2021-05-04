import sys 
import logger 
from typing import List 
import json 
import os 

__KEY_VAL_PAIRS_SEPARATOR = "KEYPAIRSEP"
__KEY_VAL_JOINER = "KEYVALSEP"    
__ARRAY_JOINER = "ARRAYSEP" 
__SPACE_JOINER = "SPACESEP"

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
            key_space_sep = keyValPairLst[0]
            key = ' '.join(key_space_sep.split(__SPACE_JOINER))
        else:
            key_space_sep, val_space_sep = keyValPairLst
            key = ' '.join(key_space_sep.split(__SPACE_JOINER))
            val = ' '.join(val_space_sep.split(__SPACE_JOINER))        
        
        cmdArgs[key] = val 
    
    return cmdArgs 

def getPythonArgsPath(currDirectory) -> str: 
    
    argsPath = os.path.join(currDirectory, 'python.json')
        
    return argsPath

def getCMDLineArgs(currDirectory) -> dict:
    pythonArgsPath = getPythonArgsPath(currDirectory)
    
    sys.stdout.flush()
    
    with open(pythonArgsPath) as python_args_file:
        raw_python_args = python_args_file.read()
        python_args = json.loads(raw_python_args)
    
    return python_args