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
from private.helpers import filesHelper, kwargsHelper, pathsHelper, keysHelper, othersHelper

from private.logs import logDecorator

MODULE_NAME = "updates.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

# TYPES 
byteMemory = Any
rawLocalTime = Any 

@genericLog
def _changeBytesToRegularMemoryFormat(nbytes: byteMemory) -> str:
    suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    i = 0
    while nbytes >= 1024 and i < len(suffixes)-1:
        nbytes /= 1024.
        i += 1
    f = ('%.2f' % nbytes).rstrip('0').rstrip('.')
    return '%s %s' % (f, suffixes[i])

@genericLog
def _getFileMemoryInBytes(filePath: str) -> int:
    return int(os.path.getsize(filePath))
    
@genericLog
def _getFileMemoryInFormat(filePath: str) -> str:
    
    fileMemoryInBytes = _getFileMemoryInBytes(filePath)
    formattedFileMemory = _changeBytesToRegularMemoryFormat(fileMemoryInBytes)
    return formattedFileMemory
    
@genericLog
def updateFileMemory(currFileInfo: dict) -> dict:
    
    CSV_PATH_KEY = keysHelper.getCSVPathKey()
    FILE_SIZE_KEY = keysHelper.getFileSizeKey()
    
    currFileInfoCopy = currFileInfo.copy()
    
    CSVFilePath = currFileInfo[CSV_PATH_KEY]
    CSVFileStandardMemory = _getFileMemoryInFormat(CSVFilePath)   
    
    currMemory = ""
    if FILE_SIZE_KEY in currFileInfo: 
        currMemory = currFileInfo[FILE_SIZE_KEY]
        
    if (currMemory != CSVFileStandardMemory):
        currFileInfoCopy[FILE_SIZE_KEY] = CSVFileStandardMemory
    
    return currFileInfoCopy

@genericLog
def _getFileLocalTime(filePath: str) -> rawLocalTime: 
    return time.localtime(os.path.getmtime(filePath))

@genericLog
def _getFormattedFileLocalTime(filePath: str) -> str: 
    
    FILE_TIME_FORMAT = othersHelper.getFileTimeFormat()
    
    rawFileTime = _getFileLocalTime(filePath)
    formattedFileTime = time.strftime(FILE_TIME_FORMAT, rawFileTime)
    return formattedFileTime

@genericLog
def updateFileDateModified(currFileInfo: dict):
    
    CSV_PATH_KEY = keysHelper.getCSVPathKey()
    FILE_MODIFY_DATE_KEY = keysHelper.getFileModifyDateKey()
    
    currFileInfoCopy = currFileInfo.copy() 
    
    CSVFilePath = currFileInfo[CSV_PATH_KEY]
    formattedFileTime = _getFormattedFileLocalTime(CSVFilePath)
    
    currFileTime = ""
    if FILE_MODIFY_DATE_KEY in currFileInfo: 
        currFileTime = currFileInfo[FILE_MODIFY_DATE_KEY]
        
    if (formattedFileTime != currFileTime):
        currFileInfoCopy[FILE_MODIFY_DATE_KEY] = formattedFileTime 
    
    return currFileInfoCopy

@genericLog 
def refreshFileInfo(currFileInfo: dict) -> dict: 
    UPDATERS = [updateFileDateModified, updateFileMemory]
    for updater in UPDATERS: 
        currFileInfo = updater(currFileInfo)
    return currFileInfo 
    
@genericLog
def refreshAndSaveFileInfo(CSVFileName: str, allFileInfo: dict):
    
    currFileInfo = allFileInfo[CSVFileName]
    
    currFileInfo = refreshFileInfo(currFileInfo)
    
    allFileInfo[CSVFileName] = currFileInfo 
    
    files.saveFileInfo(currFileInfo) 
    
@genericLog
def refreshAndSaveAllFileInfo():
    allFileInfo = files.getAllFileInfo()
    for CSVFileName in allFileInfo: 
        refreshAndSaveFileInfo(CSVFileName)
    
@genericLog
def _getUpdatedAllFileInfoCSV(CSVFileName: str, allFileInfo: dict) -> dict: 
    
    allFileInfoCopy = allFileInfo.copy() 
    allFileInfoCopy.pop(CSVFileName)
    return allFileInfoCopy
    
@genericLog
def _getGraphFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    graphFilePaths = [] 
    currFileInfo = allFileInfo[CSVFileName]
    
    GRAPH_TYPES = othersHelper.getGraphTypes()
    
    for graphType in GRAPH_TYPES: 
        if graphType in currFileInfo: 
            graphs = currFileInfo[graphType]
            for graphPath in graphs.values():
                graphFilePaths.append(graphPath)
    
    return graphFilePaths

@genericLog
def _getNonGraphFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    currFileInfo = allFileInfo[CSVFileName]
    
    nonGraphFilePaths = []
    
    PATH_KEYS = keysHelper.getPathKeys()
    
    for pathKey in PATH_KEYS: 
        filePath = currFileInfo[pathKey]
        nonGraphFilePaths.append(filePath)
    
    return nonGraphFilePaths

@genericLog
def _getAllFilePaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    nonGraphFilePaths = _getNonGraphFilePaths(CSVFileName, allFileInfo)
    graphFilePaths = _getGraphFilePaths(CSVFileName, allFileInfo)
    
    allFilePaths = nonGraphFilePaths + graphFilePaths
    
    return allFilePaths

@genericLog
def _clearAllRelatedFiles(CSVFileName: str, allFileInfo: dict):

    allFilePaths = _getAllFilePaths(CSVFileName, allFileInfo)
    for filePath in allFilePaths: 
        files.handlePathRemoval(filePath)

@genericLog
def _getRelatedGraphDirPaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    relatedGraphDirPaths = [] 
    
    ALL_GRAPHS_DIRS_PATHS = pathsHelper.getAllGraphsDirPaths()
    
    for graphDirPath in ALL_GRAPHS_DIRS_PATHS:
        relatedGraphDirPath = os.path.join(graphDirPath, CSVFileName)
        relatedGraphDirPaths.append(relatedGraphDirPath)
    
    return relatedGraphDirPaths
        
@genericLog
def _getAllRelatedDirPaths(CSVFileName: str, allFileInfo: dict) -> Collection[str]:
    
    relatedGraphDirPaths = _getRelatedGraphDirPaths(CSVFileName, allFileInfo)
    
    allRelatedDirPaths = relatedGraphDirPaths

    return allRelatedDirPaths

@genericLog
def _clearAllRelatedDirs(CSVFileName: str, allFileInfo: dict):
    
    dirPaths = _getAllRelatedDirPaths(CSVFileName, allFileInfo)
    for dirPath in dirPaths: 
        files.handlePathRemoval(dirPath)

@genericLog
def _clearCSVFileRelatedItems(CSVFileName: str, allFileInfo: dict): 
    
    _clearAllRelatedFiles(CSVFileName, allFileInfo)
    _clearAllRelatedDirs(CSVFileName, allFileInfo)

@genericLog
def _getCSVFileNameFromPath(CSVFilePath: str, allFileInfo: dict):
    
    CSV_PATH_KEY = keysHelper.getCSVPathKey()

    for fileName in allFileInfo: 
        currFileInfo = allFileInfo[fileName]
        currFileCSVPath = currFileInfo[CSV_PATH_KEY]
        if currFileCSVPath == CSVFilePath: 
            return fileName 
    
    raise Exception(f"Could not find a file associated with the given CSV path ({CSVFilePath})")

@genericLog
def _updateDeletedCSVFile(CSVFilePath: str, allFileInfo: dict) -> bool:
    
    CSVFileName = _getCSVFileNameFromPath(CSVFilePath, allFileInfo)
    _clearCSVFileRelatedItems(CSVFileName, allFileInfo)
    allFileInfo = _getUpdatedAllFileInfoCSV(CSVFileName, allFileInfo)

    return files.saveFileInfo(allFileInfo)

@genericLog
def _getUpdatedAllFileInfoHTML(HTMLFilePath: str, allFileInfo: dict):

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

@genericLog
def _updateDeletedHTMLFile(HTMLFilePath: str, allFileInfo: dict) -> bool:      

    updatedAllFileInfo = _getUpdatedAllFileInfoHTML(HTMLFilePath, allFileInfo)
    return files.saveFileInfo(updatedAllFileInfo)

@genericLog
def _getUpdateDeleteFile(filePath: str) -> Callable:
    isHTML = files.isFileHTML(filePath)
    isCSV = files.isFileCSV(filePath)    
    if (isHTML):
        return _updateDeletedHTMLFile
    if (isCSV):
        return _updateDeletedCSVFile

    raise Exception(f"Given file path ({filePath}) could not be identified as HTML nor CSV")

@genericLog
def _handleDeleteUpdateByFileType(filePath: str) -> bool:
    
    updateDeleteFile = _getUpdateDeleteFile(filePath)
    allFileInfo = files.getAllFileInfo()
    updateSuccessful = updateDeleteFile(filePath, allFileInfo)
    
    return updateSuccessful

@genericLog
def updateDeletedFileInfo(filePath: str): 
    updateSuccessful = _handleDeleteUpdateByFileType(filePath)

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

# @genericLog
# def refreshFileInfo(filePath: str): 