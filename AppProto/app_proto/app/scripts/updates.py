    """[Handles updates from deletion or refreshing basic info in files.json]

    PUBLIC MODULES:
        - updateDeletedFileInfo
        - refreshAllFileInfo
        - refreshFileInfo
    """

import os 
import shutil
import sys 
import time 
from typing import Callable, Collection, Any

# Package 
import settings 
from helpers import files 

from logs import logDecorator

# PATHS
FILE_DIR_PATH = settings.FILE_DIR_PATH 
GRAPHS_DIR_PATH = settings.GRAPHS_DIR_PATH 
GRAPHS_2D_DIR_PATH = settings.GRAPHS_2D_DIR_PATH
GRAPHS_3D_DIR_PATH = settings.GRAPHS_3D_DIR_PATH 
ALL_GRAPHS_DIRS_PATHS = settings.ALL_GRAPHS_DIR_PATHS
PRECALCS_DIR_PATH = settings.PRECALS_DIR_PATH
SCRIPTS_FILES_PATH = settings.SCRIPTS_FILES_PATH 
FILE_INFO_PATH = settings.FILE_INFO_PATH 

# OTHER
GRAPH_TYPES = settings.GRAPH_TYPES 
CSV_PATH_KEY = settings.CSV_PATH_KEY
GPS_PATH_KEY = settings.GPS_PATH_KEY 
LOG_PATH_KEY = settings.LOG_PATH_KEY 
PRECALC_KEY = settings.PRECALC_KEY 
PATH_KEYS = settings.PATH_KEYS
FILE_SIZE_KEY = settings.FILE_SIZE_KEY 
FILE_MODIFY_DATE_KEY = settings.FILE_MODIFY_DATE_KEY
FILE_TIME_FORMAT = settings.FILE_TIME_FORMAT

MODULE_NAME = "updates.py"

# TYPES 
byteMemory = Any
rawLocalTime = Any 

@logDecorator.genericLog(MODULE_NAME)
def __changeBytesToRegularMemoryFormat(nbytes: byteMemory) -> str:
    suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    i = 0
    while nbytes >= 1024 and i < len(suffixes)-1:
        nbytes /= 1024.
        i += 1
    f = ('%.2f' % nbytes).rstrip('0').rstrip('.')
    return '%s %s' % (f, suffixes[i])

@logDecorator.genericLog(MODULE_NAME)
def __getFileMemoryInBytes(filePath: str) -> int:
    return int(os.path.getsize(CSVFilePath))
    
@logDecorator.genericLog(MODULE_NAME)
def __getFileMemoryInFormat(filePath: str) -> str:
    
    fileMemoryInBytes = __getFileMemoryInBytes(filePath)
    formattedFileMemory = __changeBytesToRegularMemoryFormat(fileMemoryInBytes)
    return formattedFileMemory
    
@logDecorator.genericLog(MODULE_NAME)
def __updateFileMemory(currFileInfo: dict) -> dict:
    
    currFileInfoCopy = currFileInfo.copy()
    
    CSVFilePath = currFileInfo[CSV_PATH_KEY]
    CSVFileStandardMemory = __getFileMemoryInFormat(CSVFilePath)    
    currMemory = currFileInfo[FILE_SIZE_KEY]
    if (currMemory != CSVFileStandardMemory):
        currFileInfoCopy[FILE_SIZE_KEY] = CSVFileStandardMemory
    
    return currFileInfoCopy

@logDecorator.genericLog(MODULE_NAME)
def __getFileLocalTime(filePath: str) -> rawLocalTime: 
    return time.localtime(os.path.getmtime(CSVFilePath))

@logDecorator.genericLog(MODULE_NAME)
def __getFormattedFileLocalTime(filePath: str) -> str: 
    
    rawFileTime = __getFileLocalTime(filePath)
    formattedFileTime = time.strftime(FILE_TIME_FORMAT, rawFileTime)
    return formattedFileTime

@logDecorator.genericLog(MODULE_NAME)
def __updateFileDateModified(currFileInfo: dict):
    
    currFileInfoCopy = currFileInfo.copy() 
    
    CSVFilePath = currFileInfo[CSV_PATH_KEY]
    formattedFileTime = __getFormattedFileLocalTime(CSVFilePath)
    currFileTime = currFileInfo[FILE_MODIFY_DATE_KEY]
    if (formattedFileTime != currFileTime):
        currFileInfoCopy[FILE_MODIFY_DATE_KEY] = formattedFileTime 
    
    return currFileInfoCopy
    
@logDecorator.genericLog(MODULE_NAME)
def refreshFileInfo(CSVFileName: str, allFileInfo: dict):
    
    currFileInfo = allFileInfo[CSVFileName]
    UPDATERS = [__updateFileDateModified, __updateFileMemory]
    
    for updater in UPDATERS: 
        currFileInfo = updater(currFileInfo)
    
    allFileInfo[CSVFileName] = currFileInfo 
    
    files.saveFileInfo(currFileInfo) 
    
@logDecorator.genericLog(MODULE_NAME)
def refreshAllFileInfo():
    allFileInfo = files.getAllFileInfo()
    for CSVFileName in allFileInfo: 
        refreshFileInfo(CSVFileName)
    
@logDecorator.genericLog(MODULE_NAME)
def __getUpdatedAllFileInfoCSV(CSVFileName: str, allFileInfo: dict) -> dict: 
    
    allFileInfoCopy = allFileInfo.copy() 
    allFileInfoCopy.pop(CSVFileName)
    return allFileInfoCopy
    
@logDecorator.genericLog(MODULE_NAME):
def __getGraphFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    graphFilePaths = [] 
    currFileInfo = allFileInfo[CSVFileName]
    for graphType in GRAPH_TYPES: 
        if graphType in currFileInfo: 
            graphs = currFileInfo[graphType]
            for graphPath in graphs.values():
                graphFilePaths.append(graphPath)
    
    return graphFilePaths

@logDecorator.genericLog(MODULE_NAME):
def __getNonGraphFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    currFileInfo = allFileInfo[CSVFileName]
    
    nonGraphFilePaths = []
    for pathKey in PATH_KEYS: 
        filePath = currFileInfo[pathKey]
        nonGraphFilePaths.append(filePath)
    
    return nonGraphFilePaths

@logDecorator.genericLog(MODULE_NAME):
def __getAllFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    nonGraphFilePaths = __getNonGraphFilePaths(CSVFileName, allFileInfo)
    graphFilePaths = __getGraphFilePaths(CSVFileName, allFileInfo)
    
    allFilePaths = nonGraphFilePaths + graphFilePaths
    
    return allFilePaths

@logDecorator.genericLog(MODULE_NAME)
def __clearAllRelatedFiles(CSVFileName: str, allFileInfo: dict):

    allFilePaths = __getAllFilePaths(CSVFileName, allFileInfo)
    for filePath in allFilePaths: 
        files.handlePathRemoval(filePath)

@logDecorator.genericLog(MODULE_NAME)
def __getRelatedGraphDirPaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    relatedGraphDirPaths = [] 
    for graphDirPath in ALL_GRAPHS_DIRS_PATHS:
        relatedGraphDirPath = os.path.join(graphDirPath, CSVFileName)
        relatedGraphDirPaths.append(relatedGraphDirPath)
    
    return relatedGraphDirPaths
        
def __getAllRelatedDirPaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    relatedGraphDirPaths = __getRelatedGraphDirPaths(CSVFileName, allFileInfo)
    
    allRelatedDirPaths = relatedGraphDirPaths

    return allRelatedDirPaths
    
def __clearAllRelatedDirs(CSVFileName: str, allFileInfo: dict):
    
    dirPaths = __getAllRelatedDirPaths(CSVFileName, allFileInfo)
    for dirPath in dirPaths: 
        files.handlePathRemoval(dirPath)

@logDecorator.genericLog(MODULE_NAME)
def __clearCSVFileRelatedItems(CSVFileName: str, allFileInfo: dict): 
    
    __clearAllRelatedFiles(CSVFileName, allFileInfo)
    __clearAllRelatedDirs(CSVFileName, allFileInfo)

@logDecorator.genericLog(MODULE_NAME)
def __getCSVFileNameFromPath(CSVFilePath: str, allFileInfo: dict):

    for fileName in allFileInfo: 
        currFileInfo = allFileInfo[fileName]
        currFileCSVPath = currFileInfo[CSV_PATH_KEY]
        if currFileCSVPath == CSVFilePath: 
            return fileName 
    
    raise Exception(f"Could not find a file associated with the given CSV path ({CSVFilePath})")

@logDecorator.genericLog(MODULE_NAME)
def __updateDeletedCSVFile(CSVFilePath: str, allFileInfo: dict) -> bool:
    
    CSVFileName = __getCSVFileNameFromPath(CSVFilePath, allFileInfo)
    __clearCSVFileRelatedItems(CSVFileName, allFileInfo)
    allFileInfo = __getUpdatedAllFileInfoCSV(CSVFileName, allFileInfo)

    return files.saveFileInfo(allFileInfo)

@logDecorator.genericLog(MODULE_NAME)
def __getUpdatedAllFileInfoHTML(HTMLFilePath: str, allFileInfo: dict):

    for fileName in allFileInfo: 
        currFileInfo = allFileInfo[fileName]

        for graphType in GRAPH_TYPES: 

            if graphType in currFileInfo: 

                graphs = currFileInfo[graphType]

                for graphName, graphPath in graphs.items():

                    if graphPath == HTMLFilePath and (not os.path.isfile(HTMLFilePath)): 
                        graphsCopy = graphs.copy() 
                        graphsCopy.pop(graphName)

                        currFileInfoCopy = currFileInfo.copy() 
                        currFileInfoCopy[graphType] = graphsCopy 

                        allFileInfoCopy = allFileInfo.copy()
                        allFileInfoCopy[fileName] = currFileInfoCopy

                        return allFileInfoCopy 
    
    return allFileInfo

@logDecorator.genericLog(MODULE_NAME)
def __updateDeletedHTMLFile(HTMLFilePath: str, allFileInfo: dict) -> bool:      

    updatedAllFileInfo = __getUpdatedAllFileInfoHTML(HTMLFilePath, allFileInfo)
    return files.saveFileInfo(updatedAllFileInfo)

@logDecorator.genericLog(MODULE_NAME)
def __getUpdateDeleteFile(filePath: str) -> Callable:
    isHTML = files.isFileHTML(filePath)
    isCSV = files.isFileCSV(filePath)    
    if (isHTML):
        return __updateDeletedHTMLFile
    if (isCSV):
        return __updateDeletedCSVFile

    raise Exception(f"Given file path ({filePath}) could not be identified as HTML nor CSV")

@logDecorator.genericLog(MODULE_NAME)
def __handleDeleteUpdateByFileType(filePath: str) -> bool:
    
    updateDeleteFile = __getUpdateDeleteFile(filePath)
    allFileInfo = files.getAllFileInfo()
    updateSuccessful = updateDeleteFile(filePath, allFileInfo)
    
    return updateSuccessful

@logDecorator.genericLog(MODULE_NAME)
def updateDeletedFileInfo(filePath: str): 
    updateSuccessful = __handleDeleteUpdateByFileType(filePath)

if __name__ == "__main__":
    # print(main())
    # sys.stdout.flush()
    print(main(False, path_="C:\\Users\\joonl\\CODING\\Data-Visualization-MAPS\\AppProto\\app_proto\\app\\server\\user_files\\eg01_207aprh.csv"))
    
    # def main(html_=False, path_=None): # html_ TRUE .html file-related update 
#     """
#     Single point of entry for updates.py 
#     Behavior changes based on file to check updates for (HTML or regular)
#     """

#     info = helper_json.read(FILE_INFO_PATH)
#     if html_: 
#         return html_deleted(info)
#     else: 
#         if path_ != None and path_.endswith('csv'): # clear .csv file graphs 
#             clear_files(path_, info)
#         return all_updates(info) # update/validate files in files.json
    
    
    
    
    # def all_updates(info: dict) -> bool: 
#     """
#     Handles all updates
#     """
#     changes = False 
#     updaters = [file_exists, memory_update, modified_update]
#     for file_ in info: 
#         for updater in updaters: 
#             if updater(file_, info):
#                 changes = True 
#     if changes: 
#         removals = [] 
#         for file_ in info:
#             if info[file_] == None: 
#                 removals.append(file_)
#         for removal in removals: 
#             try: 
#                 info.pop(removal)
#             except: 
#                 pass 
#         helper_json.create(FILE_INFO_PATH, info)
#     return changes     

# @logDecorator.genericLog(MODULE_NAME)
# def refreshFileInfo(filePath: str): 