from typing import List 

from private.logs import logDecorator 

MODULE_NAME = "pathsHelper"

import settings 

__BaseDirPath = settings.BASE_DIR_PATH 
__FilesDirPath = settings.FILES_DIR_PATH 
__UserFilesDirPath = settings.USER_FILES_DIR_PATH
__DataFileDirPath = settings.DATA_FILE_DIR_PATH 
__GPSFileDirPath = settings.GPS_FILE_DIR_PATH 
__LogFileDirPath = settings.LOG_FILE_DIR_PATH 
__ScriptsFilesPath = settings.SCRIPTS_FILES_PATH
__FileInfoPath = settings.FILE_INFO_PATH 
__GraphsDirPath = settings.GRAPHS_DIR_PATH 
__Graphs2DDirPath = settings.GRAPHS_2D_DIR_PATH
__Graphs3DDirPath = settings.GRAPHS_3D_DIR_PATH
__PreCalcsDirPath = settings.PRECALCS_DIR_PATH 
__allGraphsDirPaths = settings.ALL_GRAPHS_DIR_PATHS

genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog
def getBaseDirPath() -> str:
    return __BaseDirPath 

@genericLog
def getFilesDirPath() -> str: 
    return __FilesDirPath 

@genericLog
def getUserFilesDirPath() -> str: 
    return __UserFilesDirPath

@genericLog
def getDataFileDirPath() -> str: 
    return __DataFileDirPath

@genericLog
def getGPSFileDirPath() -> str: 
    return __GPSFileDirPath

@genericLog
def getLogFileDirPath() -> str: 
    return __LogFileDirPath

@genericLog
def getScriptsFileDirPath() -> str: 
    return __ScriptsFilesPath

@genericLog
def getFileInfoPath() -> str: 
    return __FileInfoPath

@genericLog
def getGraphsDirPath() -> str: 
    return __GraphsDirPath

@genericLog
def getGraphs2DDirPath() -> str: 
    return __Graphs2DDirPath

@genericLog
def getGraphs3DDirPath() -> str: 
    return __Graphs3DDirPath

@genericLog
def getPreCalcsDirPath() -> str: 
    return __PreCalcsDirPath

@genericLog
def getAllGraphsDirPaths() -> List[str]: 
    return __allGraphsDirPaths