import unittest 
import os 
from private.helpers import pathsHelper, keysHelper
from . import helperTest
import main 

BASE_DIR = pathsHelper.getBaseDirPath()
MANUAL_TEST_DIR = os.path.join(BASE_DIR, 'manualTests')
MANUAL_TEST_FILES_DIR = os.path.join(MANUAL_TEST_DIR, 'testFiles')
MANUAL_TEST_FILES_1_DIR = os.path.join(MANUAL_TEST_FILES_DIR, 'batch1')    

class TestUploadMethod(unittest.TestCase):
    #Reminder, requires startLat and startLong with convention of N-W as positive (rather than N-E)
    
    def test_upload_basic(self):
        PARENT_DIR = MANUAL_TEST_FILES_1_DIR
        
        MODULE_NAME = 'actions'
        ACTION = 'upload'
        DATA_FILE_NAME = "gm12_172aprh.mat"
        DATA_FILE_PATH = os.path.join(PARENT_DIR, DATA_FILE_NAME)
        LOG_FILE_NAME = "gm172alog.txt"
        LOG_FILE_PATH = os.path.join(PARENT_DIR, LOG_FILE_NAME)
        GPS_FILE_NAME = "20120620_Exocetus_Focal_Follow_Gm_12_172a.xlsx"
        GPS_FILE_PATH = os.path.join(PARENT_DIR, GPS_FILE_NAME)
        START_LAT = "35.87998"
        START_LONG = "74.84635"
        
        UPLOAD_ARGS = {
            keysHelper.getModuleNameKey(): MODULE_NAME, 
            keysHelper.getActionKey(): ACTION, 
            keysHelper.getOrigDataFileNameKey(): DATA_FILE_NAME, 
            keysHelper.getOrigDataFilePathKey(): DATA_FILE_PATH, 
            keysHelper.getLogNameKey(): LOG_FILE_NAME, 
            keysHelper.getLogPathKey(): LOG_FILE_PATH, 
            keysHelper.getGPSNameKey(): GPS_FILE_NAME, 
            keysHelper.getGPSPathKey(): GPS_FILE_PATH, 
            keysHelper.getStartLatKey(): START_LAT, 
            keysHelper.getStartLongKey(): START_LONG, 
        }
        
        CMD_LINE_STR = helperTest.formatCMDLineArg(UPLOAD_ARGS)
        
        print() 
        print("ONLY CHECKS IF UPLOAD RUNS WITHOUT ERROR")
        
        print(f'CMDLINESTR: {CMD_LINE_STR}')

        result = main.main_test(CMD_LINE_STR)
        
        success = not result == "Error" 
        
        self.assertTrue(success)