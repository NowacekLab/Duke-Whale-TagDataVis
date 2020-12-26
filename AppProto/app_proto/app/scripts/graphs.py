import os
import sys
import time
import json

# CUSTOM
import helper_json
import updates
import csvmat
from actions import get_path

# Want from graphs3D once those modules are done as well
from graphs2D import html2D
from graphs3D import html3D

from settings import BASE_DIR

GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
SCRIPTS_FILES = os.path.join(BASE_DIR, 'scripts_files')
file_info = os.path.join(SCRIPTS_FILES, 'files.json')

MAIN_DIRECTORIES = [GRAPHS_DIR, GRAPHS_2D_DIR, GRAPHS_3D_DIR]

def ensure_paths(file_: str) -> bool:
    """
    Ensures that GRAPH Directories (and file) exist
    """
    CHECKING_DIRECTORIES = MAIN_DIRECTORIES.copy()
    for directory in MAIN_DIRECTORIES:
        if not os.path.exists(directory):
            os.mkdir(directory)
        check_path = os.path.join(directory, file_)
        if directory != GRAPHS_DIR and not os.path.exists(check_path):
            os.mkdir(check_path)
            CHECKING_DIRECTORIES.append(check_path)
    return all((os.path.exists(directory) for directory in CHECKING_DIRECTORIES))

def graphs_exist(file_: str, graph_type: str) -> bool:
    """
    Returns whether any graphs exist for
    given file name
    """
    csvmat.ensure_paths() # ensure user_files, files.json exist
    info = helper_json.read(file_info)

    spec_info = info[file_]
    if graph_type == "graphsMixed":
        for graph in ("graphs2D", "graphs3D"):
            if len(spec_info[graph]) == 0:
                return False
        return True
    return len(spec_info[graph_type]) > 0

def generate_graphs(file_: str, file_path: str) -> bool:
    # need to add 'graphs3D' module capabilities in the future
        # graph_generators = [html2D, html3D,...]
        # from multiprocessing import Process
        # ...
    try:
        success2D, unsaved2D = html2D.main(file_, file_path)

        time.sleep(3) # place so stdout does not lump them all 

        if success2D: 
            print('graphs2D:success')
            sys.stdout.flush()
        else: 
            print('graphs2D:fail')
            sys.stdout.flush()
        success3D, unsaved3D = html3D.main(file_, file_path)

        time.sleep(3) # place this so stdout does not lump them all 

        if success3D: 
            print('graphs3D:success')
            sys.stdout.flush()
        else: 
            print('graphs3D:fail')
            sys.stdout.flush()
        
        time.sleep(3) # place so stdout does not lump them all 
    
        return
    except Exception as e: 
        print(e) 
        sys.stdout.flush()
    
def main(file_=None, file_path=None, action=None) -> bool:
    """
    Main handler
    """

    try:

        if file_ == None and file_path == None:
            file_ = str(sys.argv[2])
            file_path = str(sys.argv[3])

        if not ensure_paths(file_):
            raise Exception("Required graph directories do not exist.")

        if action == None:
            if len(sys.argv) > 4:
                action = str(sys.argv[4])

        if action == "generate": # generate all graphs
            generate_graphs(file_, file_path)
            return "True"

    except Exception as e:
        print(e)
        sys.stdout.flush()
