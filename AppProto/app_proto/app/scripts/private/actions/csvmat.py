
"""
MAT --> CSV converter
"""
import os
import pandas as pd
from scipy.io import loadmat
import sys
import time
import json
from typing import Tuple, Any

# PACKAGE
from private.updates import updates 
from private.logs import logDecorator 
from private.helpers import pathsHelper, filesHelper, pandasHelper

MODULE_NAME = "csvmat"
genericLog = logDecorator.genericLog(MODULE_NAME)

# TYPE ALIASES  
PandasDataFrame = Any
MatFileData = Any 

@genericLog
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

@genericLog
def _loadMatFileData(filePath: str) -> MatFileData:

    # 'rb' is necessary, look at https://stackoverflow.com/questions/42339876/error-unicodedecodeerror-utf-8-codec-cant-decode-byte-0xff-in-position-0-in
    with open(filePath, 'rb') as f: 
        matFileData = loadmat(f) 
    
    return matFileData 

@genericLog
def _getParsedMatFileData(filePath: str) -> MatFileData: 
    rawMatFileData = _loadMatFileData(filePath)
    parsedMatFileData = _parseMatFileData(rawMatFileData)
    return parsedMatFileData

@genericLog
def _newCSVFileNameAndPath(fileName: str) -> Tuple[str, str]:
    
    DATA_FILE_DIR = pathsHelper.getDataFileDirPath()
    
    origName = fileName.split(".mat")[0]
    newCSVName = origName + ".csv"
    newCSVPath = os.path.join(DATA_FILE_DIR, newCSVName)
    return (newCSVPath, newCSVName)

@genericLog
def _handleMATConversionToPandasDataFrame(filePath: str) -> PandasDataFrame:
    parsedMatFileData = _getParsedMatFileData(filePath)
    pandasDataFrame = pandasHelper.getPandasDataFrameFromMatData(parsedMatFileData)

    return pandasDataFrame

@genericLog
def convertToCSVAndSave(filePath: str, fileName: str) -> Tuple[str, str]:
    newFilePath, newFileName = _newCSVFileNameAndPath(fileName)
    pandasDataFrame = _handleMATConversionToPandasDataFrame(filePath)
    pandasHelper.savePandasDataFrame(pandasDataFrame, newFilePath)

    return (newFilePath, newFileName)

@genericLog
def _needProcessToCSV(dataFileName: str) -> bool: 
    isCSV = filesHelper.isFileCSV(dataFileName)
    return not isCSV 

@genericLog
def handleProcessAndNewPathName(dataFilePath: str, dataFileName: str) -> Tuple[str]: 
    """[Processes to CSV (if needed), returns correct CSVFilePath, CSVFileName]

    Args:
        uploadArgs (dict): [original upload args parsed in main.py]

    Returns:
        Tuple[str]: [CSVFilePath, CSVFileName pairing as strings]
    """
    needToProcess = _needProcessToCSV(dataFileName)
    if not needToProcess: 
        return (dataFileName, dataFilePath)
    CSVFilePathAndName = convertToCSVAndSave(dataFilePath, dataFileName)
    return CSVFilePathAndName

if __name__ == "__main__":
    print(main())
    sys.stdout.flush() 