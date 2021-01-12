import sys 
from private.helpers import kwargsHelper, pathsHelper
from private.logs import logDecorator

MODULE_NAME = "infoRequests.py"
genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog 
def _displayAndRetLogDirPath():
    
    logDirPath = pathsHelper.getLogsDirPath()
    
    print(logDirPath)
    sys.stdout.flush()
    
    return logDirPath 

@genericLog 
def _displayAndRetFileDirPath():
    
    fileDirPath = pathsHelper.getFilesDirPath()
    
    print(fileDirPath)
    sys.stdout.flush()
    
    return fileDirPath 

@genericLog 
def _requestToHandler(request: str):
    
    requestToHandlerMap = {
        'fileDirPath': _displayAndRetFileDirPath,
        'logDirPath': _displayAndRetLogDirPath,
    }

    requestHandler = requestToHandlerMap[request]
    
    return requestHandler 

@genericLog 
def handleInfoRequest(cmdArgs: dict):
    REQUEST_KWARG = kwargsHelper.getRequestKwarg()
    request = cmdArgs[REQUEST_KWARG]
    
    requestHandler = _requestToHandler(request)
    return requestHandler()