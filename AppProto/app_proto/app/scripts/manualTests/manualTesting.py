
import os 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_FILES_DIR = os.path.join(BASE_DIR, 'testFiles')

def dirPaths():
    filesAtTestDir = os.scandir(TEST_FILES_DIR)
    for testFile in filesAtTestDir: 
        testFileName = testFile.name 
        testFilePath = os.path.join(TEST_FILES_DIR, testFileName)
        
        print(testFileName)
        print(testFilePath)
    
# * used in the 'calculations.py' folder 
# calculation('../Data/gm14_279aprh.csv', '../Data/gm279alog.txt', '../Data/20141006_Barber_Focal_Follow_Gm_14_279a.xlsx')

# gm14_279aprh.mat
# /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm14_279aprh.mat
# gm279alog.txt
# /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm279alog.txt

# FORMAT TO USE AS CMD LINE ARG TO main.py:


DATA_FILE_NAME_KWARG = "dataFileName"
DATA_FILE_PATH_KWARG = "dataFilePath"
LOG_FILE_NAME_KWARG = "logFileName"
LOG_FILE_PATH_KWARG = "logFilePath"
GPS_FILE_NAME_KWARG = "gpsFileName"
GPS_FILE_PATH_KWARG = "gpsFilePath"

def formatCMDLineArg(): 
    cmdArgs = {
        DATA_FILE_NAME_KWARG : "gm14_279aprh.mat",
        DATA_FILE_PATH_KWARG : "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm14_279aprh.mat",
        LOG_FILE_NAME_KWARG : "gm279alog.txt",
        LOG_FILE_PATH_KWARG : "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm279alog.txt",
        GPS_FILE_NAME_KWARG : "",
        GPS_FILE_PATH_KWARG : "",
    }
    
    argsToJoin = [] 
    for kwarg in cmdArgs: 
        val = cmdArgs[kwarg]
        formatted = f"{kwarg}:{val}"
        argsToJoin.append(formatted)
    
    print(";-;".join(argsToJoin))

if __name__ == "__main__":
    # dirPaths()
    formatCMDLineArg()