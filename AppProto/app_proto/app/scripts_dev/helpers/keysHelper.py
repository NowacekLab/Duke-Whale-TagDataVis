import constants 
import logger

__oldDataFilePathKey = constants.OLD_DATA_FILE_PATH_KEY
__oldDataFileDataFrameKey = constants.OLD_DATA_FILE_DATAFRAME_KEY
__newDataFilePathKey = constants.NEW_DATA_FILE_PATH_KEY
__logPathKey = constants.LOG_PATH_KEY
__logFilePathKey = constants.LOG_FILE_PATH_KEY
__gpsFilePathKey = constants.GPS_FILE_PATH_KEY
__startLatKey = constants.START_LAT_KEY
__startLongKey = constants.START_LONG_KEY

__filePathsKey = constants.FILE_PATHS 
__targetDirectoryKey = constants.TARGET_DIRECTORY 
__exportTypeKey = constants.EXPORT_TYPE 


def getOldDataFilePathKey() -> str: 
    return __oldDataFilePathKey

def getOldDataFileDataFrameKey() -> str: 
    return __oldDataFileDataFrameKey

def getNewDataFilePathKey() -> str: 
    return __newDataFilePathKey

def getLogPathKey() -> str: 
    return __logPathKey

def getLogFilePathKey() -> str: 
    return __logFilePathKey

def getGPSFilePathKey() -> str: 
    return __gpsFilePathKey

def getStartLatKey() -> str: 
    return __startLatKey 

def getStartLongKey() -> str: 
    return __startLongKey 

def getFilePathsKey() -> str:
    return __filePathsKey 

def getTargetDirectoryKey() -> str:
    return __targetDirectoryKey

def getExportTypeKey() -> str:
    return __exportTypeKey
