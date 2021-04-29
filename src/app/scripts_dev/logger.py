from typing import Callable 
from functools import wraps 
import logging 
#logging.error 

LOG_FORMAT = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
LOG_LEVEL = logging.ERROR
    
def initLogger(logFilePath: str):         
    logger = logging.getLogger("main")
    
    logHandler = logging.FileHandler(logFilePath)
    logHandler.setFormatter(LOG_FORMAT)
    logHandler.setLevel(LOG_LEVEL)
    logHandler.addFilter(customLogFilter(LOG_LEVEL))
    
    logger.addHandler(logHandler)
    logger.setLevel(logging.ERROR)
            
    return logger
        
class customLogFilter(logging.Filter): 
    def __init__(self, level):
        self._level = level 
    
    def filter(self, record):
        return record.levelno <= self._level 
    
def getLogger(moduleName: str, logFilePath: str) -> Callable:
    
    def decorator(func: Callable) -> Callable: 

        @wraps(func)
        def wrapper(*args, **kwargs):
            try: 
                return func(*args, **kwargs)
            except Exception as e: 
                
                mainLogger = initLogger(logFilePath)
                
                mainLogger.exception(f'{moduleName}:{func.__name__} method exception. Detailed: {repr(e)}')
                                
                return "ERROR"
        
        return wrapper 

    return decorator 