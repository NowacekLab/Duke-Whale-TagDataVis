from typing import Tuple, Callable
from log import logDecorator
from helpers import files
from . import csvmat 
import settings 

MODULE_NAME = "upload.py"

@logDecorator.genericLog(MODULE_NAME)
def __getCSVFilePathAndName(dataFilePath: str, dataFileName: str) -> Tuple[str]: 
    isCSV = files.isFileCSV(dataFileName)
    isMAT = files.isFileMAT(dataFileName)
    if (isCSV):
        return (dataFileName, dataFilePath)
    if (isMat):
        CSVFilePathAndName = csvmat.convertToCSVAndSave(dataFilePath, dataFileName)
    
    raise Exception(f"Data file ({dataFileName, dataFilePath}) could not be registered as CSV or MAT.")

@logDecorator.genericLog(MODULE_NAME)
def __handleCSVFilePathAndName(uploadArgs: dict): 
    

@logDecorator.genericLog(MODULE_NAME)
def __handleProcessToCSVFile(uploadArgs: dict) -> dict: 
    
    CSVFilePath, CSVFileName = __handleCSVFilePathAndName()
    

@logDecorator.genericLog(MODULE_NAME)
def __handleProcessAndCalc(uploadArgs: dict) -> dict: 
    dataFilePath = uploadArgs[settings.DATA_FILE_NAME_KWARG]
    dataFileName = uploadArgs[settings.DATA_FILE_NAME_KWARG]
    CSVFilePath, CSVFileName = __getCSVFilePathAndName(dataFilePath, dataFileName)

@logDecorator.genericLog(MODULE_NAME)
def __handleLoopableUploadKwargs(uploadArgs: dict, newFileEntry: dict) -> dict:
    newFileEntryCopy = newFileEntry.copy()
    for kwarg in settings.UPLOAD_MODULE_LOOPABLE_KWARGS:
        kwargVal = uploadArg[kwarg]
        newFileEntryCopy[kwarg] = kwargVal 
        
    return newFileEntryCopy 
        
@logDecorator.genericLog(MODULE_NAME)
def __handleNewFileEntryDict(uploadArgs: dict) -> dict: 

    newFileEntry = {}
    newFileEntry = __handleLoopableUploadKwargs(uploadArgs, newFileEntry)
    newFileEntry = __handleProcessAndCalc(uploadArgs)
    
    return newFileEntry

@logDecorator.genericLog(MODULE_NAME)
def uploadFile(uploadArgs: dict):    
    newFileEntry = __handleNewFileEntryDict(uploadArgs)
    
    
    

# @logDecorator.genericLog(MODULE_NAME)
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