from typing import List 

from private.logs import logDecorator 

MODULE_NAME = "keysHelper"
genericLog = logDecorator.genericLog(MODULE_NAME)

import settings 

__moduleNameKey = settings.MODULE_NAME_KEY 
__actionKey = settings.ACTION_KEY
__origDataFilePathKey = settings.ORIG_DATAFILE_PATH_KEY
__origDataFileNameKey = settings.ORIG_DATAFILE_NAME_KEY
__GPSNameKey = settings.GPS_NAME_KEY
__GPSPathKey = settings.GPS_PATH_KEY
__logNameKey = settings.LOG_NAME_KEY 
__logPathKey = settings.LOG_PATH_KEY 
__CSVNameKey = settings.CSV_NAME_KEY 
__CSVPathKey = settings.CSV_PATH_KEY 
__PreCalcKey = settings.PRECALC_KEY
__FileSizeKey = settings.FILE_SIZE_KEY 
__FileModifyDateKey = settings.FILE_MODIFY_DATE_KEY
__pathKeys = settings.PATH_KEYS 
__uploadModuleSaveFilePathKeys = settings.UPLOAD_MODULE_SAVE_FILE_PATH_KEYS
__graph2DKey = settings.GRAPH_2D_KEY
__graph3DKey = settings.GRAPH_3D_KEY 
__startLat = settings.START_LAT 
__startLong = settings.START_LONG 

@genericLog 
def getModuleNameKey() -> str: 
    return __moduleNameKey 

@genericLog 
def getActionKey() -> str: 
    return __actionKey 

@genericLog
def getOrigDataFilePathKey() -> str: 
    return __origDataFilePathKey 

@genericLog
def getOrigDataFileNameKey() -> str: 
    return __origDataFileNameKey

@genericLog
def getGPSNameKey() -> str: 
    return __GPSNameKey

@genericLog
def getGPSPathKey() -> str: 
    return __GPSPathKey 

@genericLog
def getLogNameKey() -> str: 
    return __logNameKey

@genericLog
def getLogPathKey() -> str: 
    return __logPathKey

@genericLog
def getCSVNameKey() -> str: 
    return __CSVNameKey

@genericLog
def getCSVPathKey() -> str: 
    return __CSVPathKey

@genericLog
def getPreCalcKey() -> str: 
    return __PreCalcKey

@genericLog
def getFileSizeKey() -> str: 
    return __FileSizeKey 

@genericLog
def getFileModifyDateKey() -> str: 
    return __FileModifyDateKey

@genericLog
def getPathKeys() -> List[str]: 
    return __pathKeys 

@genericLog
def getUploadModuleSaveFilePathKeys() -> List[str]: 
    return __uploadModuleSaveFilePathKeys

@genericLog 
def getGraph2DKey() -> str: 
    return __graph2DKey

@genericLog 
def getGraph3DKey() -> str: 
    return __graph3DKey

@genericLog 
def getStartLatKey() -> str: 
    return __startLat 

@genericLog 
def getStartLongKey() -> str: 
    return __startLong 