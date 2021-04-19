import os  
import sys 
from helpers import cmdArgs
from process import main as process_main
from mahalanobis import main as mahal_main
from export_html import main as html_main 
from export_video import main as video_main
from wavelets import main as wavelets_main 
from dives import main as dives_main 

SCRIPT_MATCHING = {
    'process': process_main,
    'mahalanobis': mahal_main, 
    'export_html': html_main,
    'export_video': video_main, 
    'wavelets': wavelets_main, 
    'dives': dives_main,
}

def _getCMDLineArgs():
    return cmdArgs.getCMDLineArgs()

def main():
    try:
        cmdLineArgs = _getCMDLineArgs() 
        script_name = cmdLineArgs['scriptName']
        script_main = SCRIPT_MATCHING[script_name]
        script_main(cmdLineArgs)
        
        return "SUCCESS" 
    except Exception as e:
        return e 

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()