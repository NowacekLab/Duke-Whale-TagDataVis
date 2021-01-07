"""
Methods for dealing with all files 
"""

import json
import os 
import shutil

from private.logs import logDecorator 
from private.helpers import keysHelper, pathsHelper
from typing import Callable 

MODULE_NAME = "helper_json.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

FILE_INFO_PATH = pathsHelper.getFileInfoPath()

@genericLog
def _doesFileExist(filePath: str) -> bool: 
    return os.path.isfile(filePath)

@genericLog
def _removeFile(filePath: str):
    os.remove(filePath)
        
@genericLog
def _doesDirExist(dirPath: str) -> bool: 
    return os.path.isdir(dirPath)

@genericLog
def _removeDir(dirPath: str):
    shutil.rmtree(dirPath)
    
@genericLog 
def createDir(dirPath: str): 
    os.mkdir(dirPath)
    
@genericLog
def createDirIfNotExist(dirPath: str):
    dirExists = _doesDirExist(dirPath)
    if not dirExists: 
        createDir(dirPath)

@genericLog
def _getPathRemover(path: str) -> Callable:
    isFile = _doesFileExist(path)
    isDir = _doesDirExist(path)
    if (isFile): 
        return _removeFile
    if (isDir):
        return _removeDir

    raise Exception(f"Given path ({path}) not found as a file nor as a directory.")

@genericLog
def handlePathRemoval(path: str):
    pathRemover = _getPathRemover(path)
    pathRemover(path)

@genericLog
def JSON_read(filePath: str) -> dict: 
    """
    Reads and returns JSON file as dict 
    at file_path if it exists, else None 
    """
    fileExists = _doesFileExist(filePath)
    if not fileExists:
        return None 

    with open(filePath) as f: 
        info = json.load(f)
    
    return info 

@genericLog
def getAllFileInfo() -> dict:
    fileInfo = JSON_read(FILE_INFO_PATH)
    return fileInfo 

@genericLog
def isFileInfoStored(fileName: str) -> dict: 
    allFileInfo = getAllFileInfo()
    return fileName in allFileInfo 

@genericLog
def getFileInfo(fileName: str) -> dict: 
    if (not isFileInfoStored(fileName)):
        return {}
    allFileInfo = getAllFileInfo()
    return allFileInfo[fileName]

@genericLog
def JSON_create(filePath: str, info: dict) -> bool: 
    """
    Creates JSON file with given info at file_path 
    NOTE: rewrites files if they exist already
    """
    with open(filePath, 'w') as f: 
        f.write(json.dumps(info, indent=4))

@genericLog
def saveFileInfo(info: dict): 
    return JSON_create(FILE_INFO_PATH, info) 

@genericLog 
def addNewFileInfoEntry(newFileInfo: dict): 
    """[Adds the new file info using the data file's CSV_NAME as the key in files.json]

    Args:
        newFileInfo (dict): [the key:value data of the new added file]
    """
    
    currFileInfo = getAllFileInfo()
    
    CSV_NAME_KEY = keysHelper.getCSVNameKey()
    CSV_NAME = newFileInfo[CSV_NAME_KEY]
    
    currFileInfo[CSV_NAME] = newFileInfo 
    
    saveFileInfo(currFileInfo)

@genericLog
def _checkFileEndingGeneric(file_: str, ending: str) -> bool:
    """
    generic function that checks if file_ ends with param 'ending' 
    """
    return file_.endswith(ending)

@genericLog
def isFileMAT(file_: str):
    """[Checks whether file_ param ends in .mat]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .mat?]
    """
    return _checkFileEndingGeneric(file_, ".mat")

@genericLog
def isFileHTML(file_: str) -> bool:
    """[Checks whether file_ param ends in .html]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .html?]
    """
    return _checkFileEndingGeneric(file_, "html")

@genericLog
def isFileCSV(file_: str) -> bool:
    """[Checks whether file_ param ends in .csv]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .csv?]
    """
    return _checkFileEndingGeneric(file_, "csv")

@genericLog
def _copyFileToNewDirPath(origFilePath: str, newDirPath: str) -> str: 

    newPath = shutil.copy(origFilePath, newDirPath)
    return newPath

@genericLog
def _copyFileToNewFilePath(origFilePath: str, newFilePath: str) -> str: 
    
    newPath = shutil.copyfile(origFilePath, newFilePath)
    return newPath

@genericLog
def _getFileCopier(destPath: str) -> Callable: 
    """[Gives appropriate file copier based on destination path of file]

    Args:
        path (str): [path in system]

    Returns:
        Callable: [copier function]
    """
    isDir = os.path.isdir(destPath)
    if isDir: 
        return _copyFileToNewDirPath 
    return _copyFileToNewFilePath

@genericLog
def copyFileToNewPath(origFilePath: str, newPath: str) -> str:
    """[Copies file at original file path to new file path]

    Args:
        origFilePath (str): [path of original file]
        newFilePath (str): [path to copy original file to]

    Returns:
        str: [new file path]
    """
    fileCopier = _getFileCopier(newPath)
    newFilePath = fileCopier(origFilePath, newPath)
    return newFilePath

# def save_calculations(file_: str, calc_file: str, data: "dataframe") -> bool:
#     """
#     False IF fail, True IF success
#     """
#     try: 
#         info = helper_json.read(file_info)
#         if not os.path.isdir(PRECALCS_DIR): 
#             os.mkdir(PRECALCS_DIR)
#         calc_file_path = os.path.join(PRECALCS_DIR, calc_file)
#         data.to_csv(calc_file_path)
#         if not 'extra' in info[file_]:
#             info[file_]['extra'] = {} 
#         info[file_]['extra'][calc_file] = calc_file_path
#         helper_json.create(file_info, info)

#         return True 
#     except Exception as e: 
#         print(e) 
#         return False 