import os  
import sys 
from helpers import cmdArgs
from plotly.io import read_json, write_html 

def html_exporter(file_path: str, new_file_path: str):
  plotly_fig = read_json(file_path)
  write_html(plotly_fig, new_file_path)

def _getCMDLineArgs():
    return cmdArgs.getCMDLineArgs()

def main(cmdLineArgs: dict):
  try:
    cmdLineArgs = _getCMDLineArgs() 
    graph_file_path = cmdLineArgs['graphFilePath']
    new_file_path = cmdLineArgs['newFilePath']    
    html_exporter(graph_file_path, new_file_path)
    
    return "SUCCESS" 
  except Exception as e:
    return e 
  
if __name__ == "__main__":
  print(main())
  sys.stdout.flush()