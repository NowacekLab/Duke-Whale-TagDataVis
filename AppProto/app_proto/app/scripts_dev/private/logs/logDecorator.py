from functools import wraps 
from typing import Callable
from . import loggers 

mainLogger = loggers.initAndGetLogger('main')

def mainLog(moduleName: str) -> Callable:
    """
    Only for MAIN log 
    """
    def decorator(func: Callable) -> Callable: 

        @wraps(func)
        def wrapper(*args, **kwargs):
            try: 
                mainLogger.info(f'{moduleName}:{func.__name__} method executing.')

                return func(*args, **kwargs)
            
            except Exception as e: 
                
                mainLogger.exception(f'{moduleName}:{func.__name__} method exception. Detailed: {repr(e)}')

                return "Error"
        
        return wrapper 

    return decorator 

def genericLog(moduleName: str) -> Callable: 
    """
    For any method to be wrapped
    """
    def decorator(func: Callable) -> Callable: 

        @wraps(func) 
        def wrapper(*args, **kwargs):
            mainLogger.info(f'{moduleName}:{func.__name__} method executing.')
            return func(*args, **kwargs)

        return wrapper 
    
    return decorator 