import os 
from helpers import cmdArgs, keysHelper

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_FILES_DIR = os.path.join(BASE_DIR, 'manualTests', 'testFiles')

# Batch 1
BATCH1_DIR = os.path.join(TEST_FILES_DIR, 'batch1')
DATA_FILE_TEST1 = os.path.join(BATCH1_DIR, 'DATA_gm12_172aprh.mat')
NEW_DATA_FILE_TEST1 = os.path.join(BATCH1_DIR, 'new', 'DATA_gm12_172aprh_precalc.csv')
LOG_PATH = os.path.join(BATCH1_DIR, 'new', 'errors.log')
LOG_FILE_PATH = os.path.join(BATCH1_DIR, 'LOG_gm172alog.txt')
GPS_FILE_PATH = os.path.join(BATCH1_DIR, "GPS_20120620_Exocetus_Focal_Follow_Gm_12_172a.xlsx")

oldDataFilePathKey = keysHelper.getOldDataFilePathKey()
newDataFilePathKey = keysHelper.getNewDataFilePathKey()
logPathKey = keysHelper.getLogPathKey()
logFilePathKey = keysHelper.getLogFilePathKey()
gpsFilePathKey = keysHelper.getGPSFilePathKey()
startLatKey = keysHelper.getStartLatKey()
startLongKey = keysHelper.getStartLongKey()

cmdArgsDict = {
    oldDataFilePathKey: DATA_FILE_TEST1,
    newDataFilePathKey: NEW_DATA_FILE_TEST1,
    logPathKey: LOG_PATH,
    logFilePathKey: LOG_FILE_PATH, 
    gpsFilePathKey: GPS_FILE_PATH,
    startLatKey: "35.87998",
    startLongKey: "74.84635"
}

cmdLineStr = cmdArgs.formatCMDLineArg(cmdArgsDict)

if __name__ == "__main__":
    print(cmdLineStr)