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
from . import csvmat, precalcs 

def processFile():
    
    

if __name__ == "__main__":
    print(processFile())
    sys.stdout.flush()
    
    
    def _preCalc(dataFilePath: str, logFilePath: str, gpsFilePath: str, startLatitude: float, startLongitude: float) -> PandasDataFrame:    
