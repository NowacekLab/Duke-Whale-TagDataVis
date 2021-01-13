import constants 
import logger

__oldDataFilePathKey = constants.OLD_DATA_FILE_PATH_KEY
__newDataFilePathKey = constants.NEW_DATA_FILE_PATH_KEY
__logPathKey = constants.LOG_PATH_KEY

def getOldDataFilePathKey() -> str: 
    return __oldDataFilePathKey

def getNewDataFilePathKey() -> str: 
    return __newDataFilePathKey

def getLogPathKey() -> str: 
    return __logPathKey