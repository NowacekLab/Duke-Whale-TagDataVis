from helpers import cmdArgs, keysHelper
import sys 
import logger 

REQUIRED_KWARGS = [keysHelper.getLogFilePathKey()]

def _getCMDLineArgs():
    cmdLineArgs = cmdArgs.getCMDLineArgs()
    
    filePathsKey = keysHelper.getFilePathsKey()
    filePathsStr = cmdLineArgs[filePathsKey]
    filePathsArr = cmdArgs.getArray(filePathsStr)
    cmdLineArgs[filePathsKey] = filePathsArr 
    
    return cmdLineArgs

def _getLogFilePath(cmdLineArgs: dict):
    logFilePathKey = keysHelper.getLogPathKey()
    return cmdLineArgs[logFilePathKey]

def export_single_generic(exporter, *args, **kwargs):
    return exporter(*args, **kwargs)

def export_iterate_generic(exporter, mult_args, *args, **kwargs):
    final_res = []
    for arg in mult_args:
        res = export_single_generic(exporter, arg, *args, **kwargs)
        final_res.append(res)
    return final_res 

# @logger.getLogger("export_generic.py", _getLogFilePath(_getCMDLineArgs()))
# def main():
#     cmdLineArgs = _getCMDLineArgs()
    
#     return "SUCCESS"

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()