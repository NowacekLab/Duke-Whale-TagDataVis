"""
This module works for both
regular files and HTML files (except 'edit' action)
"""

import os 
import sys
import subprocess 
import platform 
import shutil
from typing import Callable 

# PACKAGE
import graphs 
from private.updates import updates 
from private.actions import upload

from private.logs import logDecorator

MODULE_NAME = "actions"
genericLog = logDecorator.genericLog(MODULE_NAME)

def get_path(file_: str) -> str:
    """
    Helper, gets path for given file_ (NON html)
    """

    try: 
        info = helper_json.read(FILE_INFO_PATH)
        filtered = filter(lambda key : key == file_, info)
        file_path = info[next(filtered)]["csv_path"]
        if os.path.isfile(file_path):
            return file_path 
        return None 

    except Exception as e: 
        print(e)
        return None 

def get_path_html(parent_file: str, html_file: str) -> str:
    """
    Helper, gets path for HTML file
    """

    try:
        info = helper_json.read(FILE_INFO_PATH)
        if parent_file in info: 
            for graph_type in ('graphs2D', 'graphs3D'):
                if graph_type in info[parent_file] and html_file in info[parent_file][graph_type]:
                    file_path = info[parent_file][graph_type][html_file]
                    if len(file_path) > 0: 
                        return file_path
        return None 

    except Exception as e: 
        print(e)
        return None

def get_download_path():
    """
    Returns the default downloads path for linux or windows
    """

    if os.name == 'nt':
        import winreg
        sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
        downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
            location = winreg.QueryValueEx(key, downloads_guid)[0]
        return location
    else:
        return os.path.join(os.path.expanduser('~'), 'downloads')

def save(path_: str, file_: str, parent_file: str):
    """
    Saves the file located at the path_ parameter
    to the downloads directory

    ** For now it is hard-coded to Downloads/data_visualization, 
    should be changed to allow for user settings ** 
    """
    try: 
        downloads_dir = get_download_path() 
        proper_dir = os.path.join(downloads_dir, 'data_visualization')
        if not os.path.isdir(proper_dir):
            os.mkdir(proper_dir)
        if file_.endswith('html') and parent_file: 
            parent_dir = os.path.join(proper_dir, parent_file)
        else: 
            parent_dir = os.path.join(proper_dir, file_)
        if not os.path.isdir(parent_dir):
            os.mkdir(parent_dir)
        file_path = os.path.join(parent_dir, file_)
        shutil.copyfile(path_, file_path)

        return True 
    except: 
        return False 

def edit(path_: str, *args, **kwargs):
    """
    Opens the file located at the path_ parameter
    with the default application for the file 
    """

    if platform.system() == "Windows":
        os.startfile(path_)
    elif platform.system() == "Darwin":
        subprocess.Popen(['open', path_])
    else: 
        subprocess.Popen(['xdg-open', path_])
    return True 

def delete(path_: str, _, file_: str, *args, **kwargs):
    """
    Finds and deletes file located at path_ parameter 
    """
    try: 
        html_ = file_.endswith('html')
        os.remove(path_)
        updates.main(html_, path_)
        return True 
    except: 
        return False 

def reprocess(file_path: str, file_: str, *args, **kwargs):
    """
    Reprocesses graphs for a .csv file
    """
    try: 
        graphs.main(file_=file_, file_path=file_path, action='generate')
        return True 
    except: 
        return False 
    
@logDecorator.genericLog(MODULE_NAME)
def __checkUploadKwargs(cmdArgs: dict):
    uploadKwargs = settings.ACTION_MODULE_UPLOAD_KWARGS
    kwargsCheck.allKwargsExist(cmdArgs, uploadKwargs)

@logDecorator.genericLog(MODULE_NAME)
def __handleUpload(cmdArgs: dict):
    
    __checkUploadKwargs(cmdArgs)
    upload.uploadFile(cmdArgs)

    # ! not done yet
    

@logDecorator.genericLog(MODULE_NAME)
def __getActionExec(action: str) -> Callable: 
    actionModules = {
        "upload": __handleUpload,
        "reprocess":,
        "edit":,
        "save":,    
    }
    
    actionExec = actionModules[action]
    
    return actionExec

@logDecorator.genericLog(MODULE_NAME)
def handleAction(cmdArgs: dict): 
    
    ACTION_KWARG = settings.ACTION_KWARG
    
    if not ACTION_KWARG in cmdArgs: 
        raise Exception(f"Missing key word: {ACTION_KWARG}")
    
    action = cmdArgs[ACTION_KWARG]
    
    actionExec = getActionExec(action)
    
    return actionExec(cmdArgs)

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()