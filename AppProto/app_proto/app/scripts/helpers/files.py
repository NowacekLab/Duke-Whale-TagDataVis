"""
Methods for dealing with all files 
"""

import json
import os 
import shutil

from logs import logDecorator 
from typing import Callable 
import settings 

FILE_INFO = settings.FILE_INFO 

MODULE_NAME = "helper_json.py"

@logDecorator.genericLog(MODULE_NAME)
def __doesFileExist(filePath: str) -> bool: 
    return os.path.isfile(filePath)

@logDecorator.genericLog(MODULE_NAME)
def __removeFile(filePath: str):
    os.remove(filePath)
        
@logDecorator.genericLog(MODULE_NAME)
def __doesDirExist(dirPath: str) -> bool: 
    return os.path.isdir(dirPath)

@logDecorator.genericLog(MODULE_NAME)
def __removeDir(dirPath: str):
    shutil.rmtree(dirPath)

@logDecorator.genericLog(MODULE_NAME)
def __getPathRemover(path: str) -> Callable:
    isFile = __doesFileExist(path)
    isDir = __doesDirExist(path)
    if (isFile): 
        return __removeFile
    if (isDir):
        return __removeDir

    raise Exception(f"Given path ({path}) not found as a file nor as a directory.")

@logDecorator.genericLog(MODULE_NAME)
def handlePathRemoval(path: str):
    pathRemover = __getPathRemover(path)
    pathRemover(path)

@logDecorator.genericLog(MODULE_NAME)
def JSON_read(filePath: str) -> dict: 
    """
    Reads and returns JSON file as dict 
    at file_path if it exists, else None 
    """
    fileExists = doesFileExist(filePath)
    if not fileExists:
        return None 

    with open(filePath) as f: 
        info = json.load(f)
    
    return info 

@logDecorator.genericLog(MODULE_NAME)
def getAllFileInfo() -> dict:
    fileInfo = JSON_read(FILE_INFO)
    return fileInfo 

@logDecorator.genericLog(MODULE_NAME)
def isFileInfoStored(fileName: str) -> dict: 
    allFileInfo = getAllFileInfo()
    return fileName in allFileInfo 

@logDecorator.genericLog(MODULE_NAME)
def getFileInfo(fileName: str) -> dict: 
    if (not isFileInfoStored(fileName)):
        return {}
    allFileInfo = getAllFileInfo()
    return allFileInfo[fileName]

@logDecorator.genericLog(MODULE_NAME)
def JSON_create(filePath: str, info: dict) -> bool: 
    """
    Creates JSON file with given info at file_path 
    NOTE: rewrites files if they exist already
    """
    with open(filePath, 'w') as f: 
        f.write(json.dumps(info, indent=4))

@logDecorator.genericLog(MODULE_NAME)
def saveFileInfo(info: dict): 
    return JSON_create(FILE_INFO, info) 

@logDecorator.genericLog(MODULE_NAME)
def __checkFileEndingGeneric(file_: str, ending: str) -> bool:
    """
    generic function that checks if file_ ends with param 'ending' 
    """
    return file_.endswith(ending)

@logDecorator.genericLog(MODULE_NAME)
def isFileMAT(file_: str):
    """[Checks whether file_ param ends in .mat]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .mat?]
    """
    return checkFileEndingGeneric(file_, ".mat")

@logDecorator.genericLog(MODULE_NAME) 
def isFileHTML(file_: str) -> bool:
    """[Checks whether file_ param ends in .html]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .html?]
    """
    return checkFileEndingGeneric(file_, "html")

@logDecorator.genericLog(MODULE_NAME)
def isFileCSV(file_: str) -> bool:
    """[Checks whether file_ param ends in .csv]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .csv?]
    """
    return checkFileEndingGeneric(file_, "csv")