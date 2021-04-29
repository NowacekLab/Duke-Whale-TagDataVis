"""
Methods for dealing with all files 
"""

import json
import os 
import shutil
import ntpath 
from typing import Callable 
import logger 

def doesFileExist(filePath: str) -> bool: 
    return os.path.isfile(filePath)

def removeFile(filePath: str):
    os.remove(filePath)
    
def createFile(filePath: str): 
    with open(filePath, 'x') as f: 
        pass 
    
def createFileIfNotExist(filePath: str): 
    fileExists = doesFileExist(filePath)
    if not fileExists: 
        createFile(filePath)
        
def doesDirExist(dirPath: str) -> bool: 
    return os.path.isdir(dirPath)

def removeDir(dirPath: str):
    shutil.rmtree(dirPath)
    
def createDir(dirPath: str): 
    os.mkdir(dirPath)
    
def createDirIfNotExist(dirPath: str):
    dirExists = doesDirExist(dirPath)
    if not dirExists: 
        createDir(dirPath)

def _getPathRemover(path: str) -> Callable:
    isFile = doesFileExist(path)
    isDir = doesDirExist(path)
    if (isFile): 
        return removeFile
    if (isDir):
        return removeDir

    raise Exception(f"Given path ({path}) not found as a file nor as a directory.")

def handlePathRemoval(path: str):
    pathRemover = _getPathRemover(path)
    pathRemover(path)

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

def getAllFileInfo() -> dict:
    fileInfo = JSON_read(FILE_INFO_PATH)
    return fileInfo 

def isFileInfoStored(fileName: str) -> dict: 
    allFileInfo = getAllFileInfo()
    return fileName in allFileInfo 

def getFileInfo(fileName: str) -> dict: 
    if (not isFileInfoStored(fileName)):
        return {}
    allFileInfo = getAllFileInfo()
    return allFileInfo[fileName]

def JSON_create(filePath: str, info: dict) -> bool: 
    """
    Creates JSON file with given info at file_path 
    NOTE: rewrites files if they exist already
    """
    with open(filePath, 'w') as f: 
        f.write(json.dumps(info, indent=4))

def _checkFileEndingGeneric(file_: str, ending: str) -> bool:
    """
    generic function that checks if file_ ends with param 'ending' 
    """
    return file_.endswith(ending)

def isFileMAT(file_: str):
    """[Checks whether file_ param ends in .mat]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .mat?]
    """
    return _checkFileEndingGeneric(file_, ".mat")

def isFileHTML(file_: str) -> bool:
    """[Checks whether file_ param ends in .html]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .html?]
    """
    return _checkFileEndingGeneric(file_, "html")

def isFileCSV(file_: str) -> bool:
    """[Checks whether file_ param ends in .csv]

    Args:
        file_ (str): [can be file name or file path]

    Returns:
        [bool]: [file_ param ends in .csv?]
    """
    return _checkFileEndingGeneric(file_, "csv")

def filePathBaseName(filePath: str) -> str:
    
    head, tail = ntpath.split(filePath)
    return tail or ntpath.basename(head) 

def _copyFileToNewDirPath(origFilePath: str, newDirPath: str) -> str: 

    newPath = shutil.copy(origFilePath, newDirPath)
    return newPath

def _copyFileToNewFilePath(origFilePath: str, newFilePath: str) -> str: 
    
    newPath = shutil.copyfile(origFilePath, newFilePath)
    return newPath

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