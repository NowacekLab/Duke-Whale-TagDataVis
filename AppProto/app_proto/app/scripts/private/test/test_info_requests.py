import unittest 
from private.test import helperTest
from private.helpers import kwargsHelper, pathsHelper
from private.actions import infoRequests
import main 

class TestInfoRequest(unittest.TestCase):
    
    def test_request_file_dir_from_main(self):
        REQUEST_KWARG = kwargsHelper.getRequestKwarg()
        testCmdArgs = {
            'moduleName': 'actions',
            'action': 'request',
            REQUEST_KWARG: 'fileDirPath'
        }        
        cmdArgLine = helperTest.formatCMDLineArg(testCmdArgs)
        
        fileDirPathTest = main.main_test(cmdArgLine)
        
        FILE_DIR_PATH = pathsHelper.getFilesDirPath()

        self.assertEqual(FILE_DIR_PATH, fileDirPathTest)
        
    def test_request_file_dir_direct(self):
        REQUEST_KWARG = kwargsHelper.getRequestKwarg()
        testCmdArgs = {
            REQUEST_KWARG: 'fileDirPath'
        }        
        fileDirPathTest = infoRequests.handleInfoRequest(testCmdArgs)
        
        FILE_DIR_PATH = pathsHelper.getFilesDirPath()

        self.assertEqual(FILE_DIR_PATH, fileDirPathTest)
    
    def test_request_log_dir_direct(self):
        REQUEST_KWARG = kwargsHelper.getRequestKwarg()
        testCmdArgs = {
            REQUEST_KWARG: 'logDirPath'
        }        
        logDirPathTest = infoRequests.handleInfoRequest(testCmdArgs)
        
        LOG_DIR_PATH = pathsHelper.getLogsDirPath()

        self.assertEqual(LOG_DIR_PATH, logDirPathTest)