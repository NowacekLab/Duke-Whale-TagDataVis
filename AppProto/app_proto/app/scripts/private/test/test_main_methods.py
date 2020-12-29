from private.helpers import kwargsHelper
import unittest 
import main 
    
class TestMainMethod(unittest.TestCase):
    
    def test_parseCmdLineArg_basic(self):
        testCMDArgs = self.getTestCmdArgs()
        
        print("TEST COMMAND ARGS: ")
        print(testCMDArgs)
        print()
        
        formattedTestCMDArgs = self.formatCMDLineArg(testCMDArgs)
        
        print("FORMATTED VERSION: ")
        print(formattedTestCMDArgs)
        print()
        
        parseResult = main._parseCMDLineArg(formattedTestCMDArgs)
        
        print("PARSED RESULT: ")
        print(parseResult)
        print()
        
        resultEquivToOrig = self.dictsAreSameByItems(testCMDArgs, parseResult)
        
        self.assertTrue(resultEquivToOrig)
                
    def dictsAreSameByItems(self, firstDict: dict, secondDict: dict) -> bool: 
        
        for firstKwarg in firstDict: 
            if not firstKwarg in secondDict: return False 
            firstVal = firstDict[firstKwarg]
            secondVal = secondDict[firstKwarg]
            if not firstVal == secondVal: return False 
            
        return True 
        
    def getTestCmdArgs(self) -> dict: 
        DATA_FILE_NAME_KWARG = kwargsHelper.getDataFileNameKwarg()
        DATA_FILE_PATH_KWARG = kwargsHelper.getDataFilePathKwarg()
        LOG_FILE_NAME_KWARG = kwargsHelper.getLogFileNameKwarg()
        LOG_FILE_PATH_KWARG = kwargsHelper.getLogFilePathKwarg()
        GPS_FILE_NAME_KWARG = kwargsHelper.getGPSFileNameKwarg()
        GPS_FILE_PATH_KWARG = kwargsHelper.getGPSFilePathKwarg()

        cmdArgs = {
            DATA_FILE_NAME_KWARG : "gm14_279aprh.mat",
            DATA_FILE_PATH_KWARG : "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm14_279aprh.mat",
            LOG_FILE_NAME_KWARG : "gm279alog.txt",
            LOG_FILE_PATH_KWARG : "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/scripts/manualTests/testFiles/gm279alog.txt",
            GPS_FILE_NAME_KWARG : "",
            GPS_FILE_PATH_KWARG : "",
        }
        
        return cmdArgs
    
    def formatCMDLineArg(self, cmdArgs: dict):
        argsToJoin = [] 
        for kwarg in cmdArgs: 
            val = cmdArgs[kwarg]
            formatted = f"{kwarg}:{val}"
            argsToJoin.append(formatted)
            
        formattedArg = ";-;".join(argsToJoin)
        
        return formattedArg