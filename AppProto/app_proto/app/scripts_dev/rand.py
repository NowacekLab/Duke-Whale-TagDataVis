import os 
from helpers import cmdArgs, keysHelper

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_FILES_DIR = os.path.join(BASE_DIR, 'manualTests', 'testFiles')

# Batch 1
BATCH1_DIR = os.path.join(TEST_FILES_DIR, 'batch1')
DATA_FILE_TEST1 = os.path.join(BATCH1_DIR, 'DATA_gm12_172aprh.mat')
NEW_DATA_FILE_TEST1 = os.path.join(BATCH1_DIR, 'new', 'DATA_gm12_172aprh.csv')
LOG_PATH = os.path.join(BATCH1_DIR, 'new', 'errors.log')

oldDataFilePathKey = keysHelper.getOldDataFilePathKey()
newDataFilePathKey = keysHelper.getNewDataFilePathKey()
logPathKey = keysHelper.getLogPathKey()
cmdArgsDict = {
    oldDataFilePathKey: DATA_FILE_TEST1,
    newDataFilePathKey: NEW_DATA_FILE_TEST1,
    logPathKey: LOG_PATH 
}

cmdLineStr = cmdArgs.formatCMDLineArg(cmdArgsDict)

if __name__ == "__main__":
    print(cmdLineStr)