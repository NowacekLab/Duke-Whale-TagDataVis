
"""
MAT --> CSV converter
"""
import os
import pandas as pd
from scipy.io import loadmat
import sys
import time
import json
from typing import Tuple 

# PACKAGE
import updates
import graphs
from helpers import files 

import settings 
BASE_DIR = settings.BASE_DIR 
FILE_DIR = settings.FILE_DIR 
SCRIPTS_FILES = settings.SCRIPTS_FILES 
FILE_INFO = settings.FILE_INFO 

from logs import logDecorator 

__EXPECTED_KWARGS = ["filePath", "fileName", "logFilePath", "logFileName", "gpsFilePath", "gpsFileName"]

MODULE_NAME = "csvmat.py"

# TYPE ALIASES  
PandasDataFrame = Any
MatFileData = Any 

@logDecorator.genericLog(MODULE_NAME)
def __parseMatFileData(data: MatFileData) -> dict:

    csv_header =
    {
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

@logDecorator.genericLog(MODULE_NAME)
def __getPandasDataFrameFromMatData(matFileData: MatFileData):

    parsedData = __parseMatFileData(matFileData)
    dataFrame = pd.DataFrame(data=parsedData)
    return dataFrame 

@logDecorator.genericLog(MODULE_NAME)
def __loadMatFileData(filePath: str) -> MatFileData:

    # 'rb' is necessary, look at https://stackoverflow.com/questions/42339876/error-unicodedecodeerror-utf-8-codec-cant-decode-byte-0xff-in-position-0-in
    with open(filePath, 'rb') as f: 
        matFileData = loadmat(f) 
    
    return matFileData 

@logDecorator.genericLog(MODULE_NAME)
def __savePandasDataFrame(df: PandasDataFrame, filePath: str): 
    df.to_csv(filePath, index = False)

@logDecorator.genericLog(MODULE_NAME)
def __newCSVFileNameAndPath(fileName: str) -> Tuple[str, str]:
    origName = fileName.split(".mat")[0]
    newName = origName + ".csv"
    newPath = os.path.join(FILE_DIR, newName)
    return (newPath, newName)

@logDecorator.genericLog(MODULE_NAME)
def __handleConversionToPandasDataFrame(filePath: str) -> PandasDataFrame:
    matFileData = __loadMatFileData(filePath)
    pandasDataFrame = __getPandasDataFrameFromMatData(matFileData)

    return pandasDataFrame

@logDecorator.genericLog(MODULE_NAME)
def convertToCSVAndSave(filePath: str, fileName: str) -> Tuple[str, str]:
    newFilePath, newFileName = __newCSVFileNameAndPath(fileName)
    pandasDataFrame = __handleConversionToPandasDataFrame(filePath)
    __savePandasDataFrame(pandasDataFrame, newFilePath)

    return (newFilePath, newFileName)

if __name__ == "__main__":
    print(main())
    sys.stdout.flush() 




    # @logDecorator.log(MODULE_NAME)
# def ensure_paths(file_path: str) -> bool:
#     """
#     Ensures FILE_DIR, FILE_INFO, file_path exist
#     """

#     # different code than graphs.py, differece between directory, file
#     if not os.path.exists(FILE_DIR):
#         os.mkdir(FILE_DIR)
#     if not os.path.isfile(FILE_INFO):
#         with open(FILE_INFO, 'w') as f:
#             f.write(json.dumps(dict()))

#     return os.path.isfile(FILE_INFO) and os.path.exists(FILE_DIR) and os.path.isfile(file_path)