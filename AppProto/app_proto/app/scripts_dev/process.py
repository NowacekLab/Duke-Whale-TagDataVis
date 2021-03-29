
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
import precalcs 
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
        try: 
            
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
        except Exception: 
            pass 

    return d 

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

def _handleCSVConversionToPandasDataFrame(filePath: str) -> PandasDataFrame:
    return pandasHelper.getPandasDataFrameFromCSVPath(filePath)

def _getNewDataFilePath(args: dict) -> str: 
    newDataFilePathKey = keysHelper.getNewDataFilePathKey()
    return args[newDataFilePathKey]   

def _fileExists(filePath: str) -> bool: 
    return pathHelper.doesFileExist(filePath)


def _isFileMAT(filePath: str):
    return pathHelper.isFileMAT(filePath)

def _isFileCSV(filePath: str):
    return pathHelper.isFileCSV(filePath)

def _getPandasDataFrameProcessor(filePath: str):
    isCSV = _isFileCSV(filePath)
    isMAT = _isFileMAT(filePath)
    
    if (isMAT):
        return _handleMATConversionToPandasDataFrame
    
    if (isCSV):
        return _handleCSVConversionToPandasDataFrame
    
def _getPandasDataFrameFromFile(filePath: str):
    
    pandasDataFrameProcessor = _getPandasDataFrameProcessor(filePath)

    return pandasDataFrameProcessor(filePath)

def _getOrigDataFilePath(args: dict) -> str:
    origDataFilePathKey = keysHelper.getOldDataFilePathKey()
    return args[origDataFilePathKey]

def _getOrigFilePandasDataFrame(cmdLineArgs: dict):
    origDataFilePath = _getOrigDataFilePath(cmdLineArgs)
    return _getPandasDataFrameFromFile(origDataFilePath)

def _verifyProcessSuccess(cmdLineArgs: dict):
    newDataFilePath = _getNewDataFilePath(cmdLineArgs)
    successful = _fileExists(newDataFilePath)
    if not successful: 
        raise Exception("File conversion failed. File was not found at its new path.")

def _handlePreCalculate(cmdLineArgs: dict): 
    return precalcs.handlePreCalculate(cmdLineArgs)

def _addOrigFilePandasDataFrame(cmdLineArgs: dict) -> dict:
    cmdLineArgsCopy = cmdLineArgs.copy()
    
    origFileDataFrameKey = keysHelper.getOldDataFileDataFrameKey()
    origFilePandasDataFrame = _getOrigFilePandasDataFrame(cmdLineArgs)
    
    cmdLineArgsCopy[origFileDataFrameKey] = origFilePandasDataFrame
    
    return cmdLineArgsCopy

def _getCMDLineArgs():
    return cmdArgs.getCMDLineArgs() 

def _getLogFilePath(cmdLineArgs: dict):
    logFilePathKey = keysHelper.getLogPathKey()
    return cmdLineArgs[logFilePathKey]

def processFile(cmdLineArgs: dict):
    cmdLineArgs = _addOrigFilePandasDataFrame(cmdLineArgs)    
    _handlePreCalculate(cmdLineArgs)
    _verifyProcessSuccess(cmdLineArgs)

@logger.getLogger("csvmat.py", _getLogFilePath(_getCMDLineArgs()))
def main():
    cmdLineArgs = _getCMDLineArgs()
    processFile(cmdLineArgs)
    return "SUCCESS"

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()