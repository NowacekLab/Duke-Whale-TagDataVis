"""
This module works for both
regular files and HTML files (except 'edit' action)
"""

import os 
import sys
import subprocess 
import platform 
import shutil

import graphs 

import helper_json, updates

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
file_info = os.path.join(BASE_DIR, 'files.json')

def get_path(file_: str) -> str:
    """
    Helper, gets path for given file_ (NON html)
    """

    try: 
        info = helper_json.read(file_info)
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
        info = helper_json.read(file_info)
        if all((
            parent_file in info, 
            'graphs2D' in info[parent_file],
            html_file in info[parent_file]['graphs2D'],
        )):
            file_path = info[parent_file]['graphs2D'][html_file]
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

def regenerate(file_path: str, file_: str, *args, **kwargs):
    """
    Regenerates graph for a .csv file
    """
    try: 
        graphs.main(file_=file_, file_path=file_path, action='generate')
        return True 
    except: 
        return False 

def main() -> str:
    """
    Main handler
    'True' IF successful ELSE 'False'
    """
    try: 
        file_ = sys.argv[1]
        action = sys.argv[2]

        html_ = file_.endswith('.html')
        parent_file = ""
        if len(sys.argv) > 3 and html_:
            parent_file = sys.argv[3] # need to know which file belongs to 
            path = get_path_html(parent_file, file_)
        else: # for regular files 
            path = get_path(file_)

        available = {
            'delete': delete,
            'edit': edit,
            'save': save,
            'regenerate': regenerate,
        }

        func = available.get(action, None)

        if func == None or path == None: 
            raise Exception("Not a valid action or file not found.")
        result = func(path, file_, parent_file)
        if result: 
            return "True"
        else: 
            return "False"

    except Exception as e: 
        return e 


def test() -> str:
    """
    Main handler -- TEST 
    'True' IF successful ELSE 'False'
    """

    file_ = 'patients.csv'
    action = 'save'

    available = {
        'delete': delete,
        'edit': edit,
        'save': save,
    }

    func = available.get(action, None)
    path = get_path(file_)

    try: 
        if func == None or path == None: 
            raise Exception("Not a valid action.")
        result = func(path, file_)
        if result: 
            return "True"
        else: 
            return "False"

    except Exception as e: 
        return e 


if __name__ == "__main__":
    print(main())
    sys.stdout.flush()
    # print(test())
    # print('hi')