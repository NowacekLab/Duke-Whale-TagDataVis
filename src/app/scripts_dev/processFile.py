"""[Script to process file]
    REQUIRES:
        * JSON string with...
            * dataFilePath (str)
            * logFilePath (str)
            * gpsFilePath (str)
            * startLatitude (str) - N positive 
            * startLongitude (str) - W positive
        
    RESPONSES: 
        * saves and returns file paths of CSV file and CSV preprocessing file IF successful, else ERROR
"""

import sys 
from . import csvmat, precalcs, parser 

def _parseCMDLineStr(cmdLineStr: str) -> dict: 
    return parser.parseCMDLineArg(cmdLineStr)

def _getCMDLineStr() -> str:
    
    if not (len(sys.argv) == 2):
        raise Exception(f"There must be exactly 2 cmd line args given. Was given {len(sys.argv)} = {' '.join(sys.argv)}. Check conventions.md")
    
    cmdLineStr = sys.argv[1]
    return cmdLineStr 

def _getCMDLineArgs() -> dict:
    
    cmdLineStr = _getCMDLineStr()
    cmdArgs = _parseCMDLineStr(cmdLineStr)
    return cmdArgs 

def processFile():
    try: 
        
    except Exception as e: 
        print(f"ERROR:{repr(e)}")

if __name__ == "__main__":
    print(processFile())
    sys.stdout.flush()
    
    
    def _preCalc(dataFilePath: str, logFilePath: str, gpsFilePath: str, startLatitude: float, startLongitude: float) -> PandasDataFrame:    
