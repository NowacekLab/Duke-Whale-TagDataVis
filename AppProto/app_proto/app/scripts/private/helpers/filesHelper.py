"""
Methods for dealing with all files 
"""

import json
import os 
import shutil

from private.logs import logDecorator
from typing import Callable 
import settings 

MODULE_NAME = "helper_json.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog
def __doesFileExist(filePath: str) -> bool: 
    return os.path.isfile(filePath)

@genericLog
def __removeFile(filePath: str):
    os.remove(filePath)
        
@genericLog
def __doesDirExist(dirPath: str) -> bool: 
    return os.path.isdir(dirPath)

@genericLog
def __removeDir(dirPath: str):
    shutil.rmtree(dirPath)
    
@genericLog 
def createDir(dirPath: str): 
    os.mkdir(dirPath)
    
@genericLog
def createDirIfNotExist(dirPath: str):
    dirExists = __doesDirExist(dirPath)
    if not dirExists: 
        createDir(dirPath)

@genericLog
def __getPathRemover(path: str) -> Callable:
    isFile = __doesFileExist(path)
    isDir = __doesDirExist(path)
    if (isFile): 
        return __removeFile
    if (isDir):
        return __removeDir

    raise Exception(f"Given path ({path}) not found as a file nor as a directory.")

@genericLog
def handlePathRemoval(path: str):
    pathRemover = __getPathRemover(path)
    pathRemover(path)

@genericLog
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
def __checkFileEndingGeneric(file_: str, ending: str) -> bool:
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
    return checkFileEndingGeneric(file_, ".mat")

@genericLog
def isFileHTML(file_: str) -> bool:
    """[Checks whether file_ param ends in .html]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .html?]
    """
    return checkFileEndingGeneric(file_, "html")

@genericLog
def isFileCSV(file_: str) -> bool:
    """[Checks whether file_ param ends in .csv]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .csv?]
    """
    return checkFileEndingGeneric(file_, "csv")

@genericLog
def __copyFileToNewDirPath(origFilePath: str, newDirPath: str) -> str: 

    newPath = shutil.copy(origFilePath, newDirPath)
    return newPath

@genericLog
def __copyFileToNewFilePath(origFilePath: str, newFilePath: str) -> str: 
    
    newPath = shutil.copyfile(origFilePath, newFilePath)
    return newPath

@genericLog
def __getFileCopier(destPath: str) -> Callable: 
    """[Gives appropriate file copier based on destination path of file]

    Args:
        path (str): [path in system]

    Returns:
        Callable: [copier function]
    """
    isDir = os.path.isdir(destPath)
    if isDir: 
        return __copyFileToNewDirPath 
    return __copyFileToNewFilePath

@genericLog
def copyFileToNewPath(origFilePath: str, newPath: str) -> str:
    """[Copies file at original file path to new file path]

    Args:
        origFilePath (str): [path of original file]
        newFilePath (str): [path to copy original file to]

    Returns:
        str: [new file path]
    """
    fileCopier = __getFileCopier(newPath)
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