
"""
MAT --> CSV converter
"""
from scipy.io import loadmat
from typing import Tuple, Any, Callable 
import os
import pandas as pd
import sys
import time
import json

# PACKAGE
from helpers import cmdArgs, pandasHelper, pathHelper, keysHelper 
import logger 

# TYPE ALIASES  
PandasDataFrame = Any
MatFileData = Any 

def _parseMatFileData(data: MatFileData) -> dict:

    csv_header = {
        'fs':'fs',
        'p':'Depth',
        'head':'Heading',
        'pitch':'Pitch',
        'roll':'Roll',
        'Aw':'WhaleAccel',
        'A':'Accel',
        'Mw':'WhaleMag',
        'M':'Mag'
    }

    headers=['fs','p','head','pitch','roll','Aw','A','Mw','M']
    sub_headers=['_X','_Y','_Z']
    d={}
    for header in headers:
        key=csv_header[header]
        values='null'
        shape=data[header].shape

        is3D=False
        if header=='fs':
            values=data[header][0,0]
            d[key]=values
        else:
            ds=data[header]
            if shape==(1,1):
                #a struct
                ds=data[header]['data'][0][0]
                is3D=True
            if shape[1]==3:
                is3D=True

            if is3D==True:

                for i in range(3):
                    key=csv_header[header]+sub_headers[i]
                    values=ds[:,i]
                    d[key]=values
            else:
                d[key]=ds[:,0]

    return d 

def _savePandasDataFrame(pandasDataFrame: PandasDataFrame, newDataFilePath: str) -> str: 
    pandasHelper.savePandasDataFrame(pandasDataFrame, newDataFilePath)
    return newDataFilePath

def _loadMatFileData(filePath: str) -> MatFileData:
    # 'rb' is necessary, look at https://stackoverflow.com/questions/42339876/error-unicodedecodeerror-utf-8-codec-cant-decode-byte-0xff-in-position-0-in
    with open(filePath, 'rb') as f: 
        matFileData = loadmat(f) 
    
    return matFileData 

def _getPandasDataFrameFromMatData(matFileData: MatFileData) -> PandasDataFrame: 
    return pandasHelper.getPandasDataFrameFromMatData(matFileData)

def _getParsedMatFileData(filePath: str) -> MatFileData: 
    rawMatFileData = _loadMatFileData(filePath)
    parsedMatFileData = _parseMatFileData(rawMatFileData)
    return parsedMatFileData

def _handleMATConversionToPandasDataFrame(filePath: str) -> PandasDataFrame:
    parsedMatFileData = _getParsedMatFileData(filePath)
    pandasDataFrame = _getPandasDataFrameFromMatData(parsedMatFileData)
    return pandasDataFrame

def convertToCSVAndSave(origDataFilePath: str, newDataFilePath: str) -> str:
    pandasDataFrame = _handleMATConversionToPandasDataFrame(origDataFilePath)
    _savePandasDataFrame(pandasDataFrame, newDataFilePath)

def _saveFile(origDataFilePath: str, newDataFilePath: str):
    pathHelper.copyFileToNewPath(origDataFilePath, newDataFilePath)

def _isFileCSV(dataFileName: str) -> bool: 
    return pathHelper.isFileCSV(dataFileName)

def _filePathBaseName(filePath: str) -> str: 
    return pathHelper.filePathBaseName(filePath)

def _needProcessToCSV(dataFilePath: str) -> bool: 
    dataFileName = _filePathBaseName(dataFilePath)
    isCSV = _isFileCSV(dataFileName)
    return not isCSV 

def _getProcessor(origDataFilePath) -> Callable:
    needToProcess = _needProcessToCSV(origDataFilePath)
    if needToProcess: 
        return convertToCSVAndSave
    else: 
        return _saveFile 

def _handleProcessToCSV(origDataFilePath: str, newDataFilePath: str) -> str:     
    processor = _getProcessor(origDataFilePath)
    processor(origDataFilePath, newDataFilePath)

def _getNewDataFilePath(args: dict) -> str: 
    newDataFilePathKey = keysHelper.getNewDataFilePathKey()
    return args[newDataFilePathKey]

def _getOrigDataFilePath(args: dict) -> str:
    origDataFilePathKey = keysHelper.getOldDataFilePathKey()
    return args[origDataFilePathKey]

def _getCMDLineArgs():
    return cmdArgs.getCMDLineArgs()    

def _fileExists(filePath: str) -> bool: 
    return pathHelper.doesFileExist(filePath)

def _verifyProcessSuccess(newDataFilePath: str):
    successful = _fileExists(newDataFilePath)
    if not successful: 
        raise Exception("File conversion failed. File was not found at its new path.")

def _getLogFilePath(cmdLineArgs: dict):
    logFilePathKey = keysHelper.getLogPathKey()
    return cmdLineArgs[logFilePathKey]

@logger.getLogger("csvmat.py", _getLogFilePath(_getCMDLineArgs()))
def processToCSV():
    cmdLineArgs = _getCMDLineArgs()
    origDataFilePath = _getOrigDataFilePath(cmdLineArgs)
    newDataFilePath = _getNewDataFilePath(cmdLineArgs)
    _handleProcessToCSV(origDataFilePath, newDataFilePath)
    _verifyProcessSuccess(newDataFilePath) 
    
    return "Success"

if __name__ == "__main__":
    print(processToCSV())
    sys.stdout.flush()