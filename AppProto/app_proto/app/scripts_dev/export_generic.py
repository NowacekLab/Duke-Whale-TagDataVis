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

@logger.getLogger("export_html.py", _getLogFilePath(_getCMDLineArgs(required = REQUIRED_KWARGS)))
def main():
    cmdLineArgs = _getCMDLineArgs()
    
    return "SUCCESS"

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()