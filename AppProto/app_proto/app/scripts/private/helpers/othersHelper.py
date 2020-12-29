from typing import List 

from private.logs import logDecorator 

MODULE_NAME = "othersHelper"
genericLog = logDecorator.genericLog(MODULE_NAME)

import settings 
__fileTimeFormat = settings.FILE_TIME_FORMAT
__graphTypes = settings.GRAPH_TYPES 

@genericLog 
def getFileTimeFormat() -> str: 
    return __fileTimeFormat 

@genericLog
def getGraphTypes() -> List[str]: 
    return __graphTypes