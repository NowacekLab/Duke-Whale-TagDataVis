import sys, time 
from typing import Tuple, Callable
from private.logs import logDecorator
from private.actions import csvmat, precalcs
from private.helpers import pathsHelper, keysHelper, kwargsHelper, filesHelper
from private.graphs import graphs 

MODULE_NAME = "upload.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog 
def _handleGeneratingGraphs(uploadArgs: dict) -> dict: 
    uploadArgs = graphs.handleGenerateAllGraphs(uploadArgs)
    return uploadArgs

@genericLog
def _handlePreCalculate(uploadArgs: dict) -> dict: 
    uploadArgs = precalcs.handlePreCalculate(uploadArgs)
    return uploadArgs

@genericLog
def _saveNeededFiles(uploadArgs: dict) -> dict: 
    """[Saves needed files locally as specified in settings and returns uploadArgs dict with new paths to saved files]

    Args:
        uploadArgs (dict): [original upload args parsed in main.py]

    Returns:
        dict: [upload args with new paths to locally saved files]
    """
    
    uploadArgsCopy = uploadArgs.copy()
    
    UPLOAD_MODULE_SAVE_FILE_PATH_KEYS = keysHelper.getUploadModuleSaveFilePathKeys()
    
    for saveFilePathKey, saveFileDir in UPLOAD_MODULE_SAVE_FILE_PATH_KEYS:
        saveFilePath = uploadArgs[saveFilePathKey]
        newFilePath = filesHelper.copyFileToNewPath(saveFilePath, saveFileDir)
        uploadArgsCopy[saveFilePathKey] = newFilePath 
    
    return uploadArgsCopy

@genericLog
def _processAndAddNewPathName(uploadArgs: dict) -> dict: 
    """[Processes data file to CSV and returns uploadArgs dict with new CSV path/name]

    Args:
        uploadArgs (dict): [original upload args parsed in main.py]

    Returns:
        dict: [upload args with new CSV path/name]
    """

    DATA_FILE_PATH_KWARG = kwargsHelper.getDataFilePathKwarg()
    DATA_FILE_NAME_KWARG = kwargsHelper.getDataFileNameKwarg()
    
    dataFilePath = uploadArgs[DATA_FILE_PATH_KWARG]
    dataFileName = uploadArgs[DATA_FILE_NAME_KWARG]
    CSVFilePath, CSVFileName = csvmat.handleProcessAndNewPathName(dataFilePath, dataFileName)
    
    CSV_PATH_KEY = keysHelper.getCSVPathKey()
    CSV_NAME_KEY = keysHelper.getCSVNameKey()
    
    uploadArgsCopy = uploadArgs.copy() 
    uploadArgsCopy[CSV_PATH_KEY] = CSVFilePath 
    uploadArgsCopy[CSV_NAME_KEY] = CSVFileName
    
    return uploadArgsCopy

@genericLog
def _handleProcessDataToCSV(uploadArgs: dict):
    uploadArgs = _processAndAddNewPathName(uploadArgs)
    return uploadArgs
    
@genericLog
def uploadFile(uploadArgs: dict) -> dict:    
    
    try: 
        uploadArgs = _handleProcessDataToCSV(uploadArgs)   
        
        print('converted')
        sys.stdout.flush()
        time.sleep(3)
        
        uploadArgs = _saveNeededFiles(uploadArgs)
        uploadArgs = _handlePreCalculate(uploadArgs)
        
        print('processed')
        sys.stdout.flush()
        time.sleep(3)
        
        uploadArgs = _handleGeneratingGraphs(uploadArgs)
        
        print('graphs')
        sys.stdout.flush()
        time.sleep(3)
        
    except Exception as e:
        reset.resetUpload(uploadArgs)
        raise Exception(e)
    
    return uploadArgs 
    
# * 1. process data file to CSV
# * 2. save log file locally
# * 3. save gps file locally 
# * 4. precalculate
# * 5. generate graphs 
# 6. SAVE INFORMATION 
# -- IF IT GOES WRONG, DELETE EVERYTHING 

# TODO: LOG and GPS file need to be deleted appropriately when resetting or deleting a file
    

# @genericLog
# def main() -> str:

#     info = helper_json.read(FILE_INFO)
#     if not info: 
#         info = dict() 

#     new_info = dict() 

#     new_info['logFilePath'] = logFilePath
#     new_info['gpsFilePath'] = gpsFilePath

#     if file_.endswith('.csv'): 
#         new_info['orig_path'] = file_path 
#         conversion_path = file_path
#         new_info['csv_path'] = conversion_path 
#         new_info['original_name'] = file_
#         conversion = file_ 
#     elif file_.endswith('.mat'):
#         new_info['orig_path'] = file_path 
#         conversion_path, conversion = convert(file_path, file_)
#         if conversion_path == None: raise Exception("Failed in converting file.")
#         new_info['csv_path'] = conversion_path
#         new_info['original_name'] = file_ 
#     else: 
#         raise Exception("Unknown file format.")

#     info[conversion] = new_info 

#     if not helper_json.create(FILE_INFO, info): 
#         raise Exception("Failed in final creation of new files.json file.")

#     updates.main() 

#     if os.path.exists(conversion_path):

#         print("processed:success")
#         sys.stdout.flush()

#         return graphs.main(
#                 file_=conversion, 
#                 file_path=conversion_path, 
#                 action='generate')
    
#     else: 
#         print("processed:fail")

#     return "False"