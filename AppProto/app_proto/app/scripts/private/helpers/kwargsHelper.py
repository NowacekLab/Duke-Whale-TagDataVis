    """[For checking whether given cmd line kwargs match required kwargs]

        PUBLIC MODULES: 
        - allKwargsExist 
    """

from typing import Collection 
from private.logs import logDecorator 

import settings 

MODULE_NAME = "kwargsCheck.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

__dataFileNameKwarg = settings.DATA_FILE_NAME_KWARG
__dataFilePathKwarg = settings.DATA_FILE_PATH_KWARG 
__logFileNameKwarg = settings.LOG_FILE_NAME_KWARG 
__logFilePathKwarg = settings.LOG_FILE_PATH_KWARG
__gpsFileNameKwarg = settings.GPS_FILE_NAME_KWARG
__gpsFilePathKwarg = settings.GPS_FILE_PATH_KWARG 
__actionKwarg = settings.ACTION_KWARG 
__grapherDataAxisIndicesKwarg = settings.GRAPHERS_DATA_AXIS_INDICES_KWARG
__graphersPreCalcAxisIndicesKwarg = settings.GRAPHERS_PRECALC_AXIS_INDICES_KWARG
__graphersDataFileKwarg = settings.GRAPHERS_DATA_FILE_KWARG 
__graphersPreCalcFileKwarg = settings.GRAPHERS_PRECALC_FILE_KWARG 

@genericLog
def getDataFileNameKwarg() -> str: 
    return __dataFileNameKwarg

@genericLog
def getDataFilePathKwarg() -> str: 
    return __dataFilePathKwarg

@genericLog
def getLogFileNameKwarg() -> str: 
    return __logFileNameKwarg

@genericLog
def getLogFilePathKwarg() -> str: 
    return __logFilePathKwarg

@genericLog
def getGPSFileNameKwarg() -> str: 
    return __gpsFileNameKwarg

@genericLog
def getGPSFilePathKwarg() -> str: 
    return __gpsFilePathKwarg

@genericLog
def getActionKwarg() -> str: 
    return __actionKwarg 

@genericLog
def getGrapherDataAxisIndicesKwarg() -> str: 
    return __grapherDataAxisIndicesKwarg

@genericLog
def getGrapherPreCalcAxisIndicesKwarg() -> str: 
    return __graphersPreCalcAxisIndicesKwarg

@genericLog
def getGrapherDataFileKwarg() -> str: 
    return __graphersDataFileKwarg

@genericLog
def getGrapherPrecalcFileKwarg() -> str: 
    return __graphersPreCalcFileKwarg