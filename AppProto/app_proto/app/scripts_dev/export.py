import export_html 
from helpers import keysHelper, cmdArgs
import logger 

def _getTargetDir(cmdLineArgs: dict):
  targetDirKey = keysHelper.getTargetDirectoryKey()
  return cmdLineArgs[targetDirKey]

def _getFilePaths(cmdLineArgs: dict):
  filePathKey = keysHelper.getFilePathsKey()
  return cmdLineArgs[filePathKey]

def _getExportType(cmdLineArgs: dict):
  exportTypeKey = keysHelper.getExportTypeKey()
  return cmdLineArgs[exportTypeKey]

def _getCMDLineArgs():
  return cmdArgs.getCMDLineArgs()  
  
def _getLogFilePath(cmdLineArgs: dict):
  logFilePathKey = keysHelper.getLogPathKey()
  return cmdLineArgs[logFilePathKey]

def _getExporter(cmdLineArgs: dict):
  exporters = {
    'html': export_html.export_html_multiple
  }
  export_type = _getExportType(cmdLineArgs) 
  return exporters[export_type]

def export(cmdLineArgs: dict):
  file_paths = _getFilePaths(cmdLineArgs)
  target_dir = _getTargetDir(cmdLineArgs)
  exporter = _getExporter(cmdLineArgs)
  return exporter(file_paths, target_dir)

@logger.getLogger("export.py", _getLogFilePath(_getCMDLineArgs()))
def main():
    cmdLineArgs = _getCMDLineArgs()
    export(cmdLineArgs)
    return "SUCCESS" 
  
if __name__ == "__main__":
  print(main())