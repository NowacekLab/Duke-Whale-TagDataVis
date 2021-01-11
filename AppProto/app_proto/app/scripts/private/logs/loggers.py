import os 
import logging 
from typing import List 

from . import loggerSettings 

LOGS_DIR = loggerSettings.LOGS_DIR 
LOG_FILE_TYPES = loggerSettings.LOG_FILE_TYPES
LOG_FILE_LEVELS = loggerSettings.LOG_FILE_LEVELS
LOG_FORMAT = loggerSettings.LOG_FORMAT 
customLogFilter = loggerSettings.customLogFilter

class customLogFilter(logging.Filter): 
    def __init__(self, level):
        self._level = level 
    
    def filter(self, record):
        return record.levelno <= self._level 

def _logFilePathFromType(logFileType: str):
    """
    Gets the file path of the given log file type 
    """
    logFileName = f'{logFileType}.log'
    logFilePath = os.path.join(LOGS_DIR, logFileName)
    return logFilePath 

def _logFileTypeExist(logFileType: str):
    """
    Checks if a log file of the given log file type exist
    """
    logFilePath = _logFilePathFromType(logFileType)
    return os.path.exists(logFilePath)

def _createLogFilePathsIfNotExist():
    """
    Checks if log file paths exist from the log file types
    If not, creates them 
    """

    for logFileType in LOG_FILE_TYPES: 
        logFileExists = _logFileTypeExist(logFileType)
        if not logFileExists: 
            logFilePath = _logFilePathFromType(logFileType)
            with open(logFilePath, 'x'):
                pass 

def _getLogFilePathsByType() -> dict:
    """
    Gets mapping of log file type to 
    path to the associated log file 
    """

    typeToPath = {}

    for logFileType in LOG_FILE_TYPES: 
        logFilePath = _logFilePathFromType(logFileType)
        typeToPath[logFileType] = logFilePath 

    return typeToPath  

def _handleCreateAndGetLogFilePaths() -> dict:
    """
    Wraps 
    - log path creation 
    - log file path by type 
    """

    _createLogFilePathsIfNotExist()

    filePathsByType = _getLogFilePathsByType()

    return filePathsByType

def _getLogFileHandlersByType() -> dict:
    """
    Gets mapping of log file type 
    to log file handlers 
    """

    logFileHandlersByType = {}

    logFilePathsByType = _handleCreateAndGetLogFilePaths()
    for logFileType in logFilePathsByType:
        logFilePath = logFilePathsByType[logFileType]
        fileHandler = logging.FileHandler(logFilePath)
        logFileHandlersByType[logFileType] = fileHandler
    
    return logFileHandlersByType

def _initLogFileHandlers() -> List["logFileHandlers"]: 
    """
    Initializes and returns log file handlers 
    """

    logFileHandlersByType = _getLogFileHandlersByType() 

    logFileHandlers = [] 

    for logFileType, logFileLevel in zip(LOG_FILE_TYPES, LOG_FILE_LEVELS):
        logFileHandler = logFileHandlersByType[logFileType]

        logFileHandler.setLevel(logFileLevel)
        logFileHandler.addFilter(customLogFilter(logFileLevel))
        logFileHandler.setFormatter(LOG_FORMAT)

        logFileHandlers.append(logFileHandler)

    return logFileHandlers

def _initLogger(name: str):
    """
    Intializes and returns logger 
    """

    logger = logging.getLogger(name)

    logFileHandlers = _initLogFileHandlers()

    for logFileHandler in logFileHandlers:
        logger.addHandler(logFileHandler)
    
    logger.setLevel(logging.DEBUG)

    return logger 

def initAndGetLogger(name: str):
    logger = _initLogger(name) 
    return logger 