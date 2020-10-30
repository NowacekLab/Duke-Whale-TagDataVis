import os 
import sys
import subprocess 
import platform 
import webbrowser 
import shutil

import helper_json, updates

BASE_DIR = os.path.dirname(__file__)
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
file_info = os.path.join(BASE_DIR, 'files.json')

def get_path(file_: str):
    """
    Helper, gets path for given file_ 
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

def get_download_path():
    """Returns the default downloads path for linux or windows"""
    if os.name == 'nt':
        import winreg
        sub_key = r'SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders'
        downloads_guid = '{374DE290-123F-4565-9164-39C4925E467B}'
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, sub_key) as key:
            location = winreg.QueryValueEx(key, downloads_guid)[0]
        return location
    else:
        return os.path.join(os.path.expanduser('~'), 'downloads')

def save(path_: str, file_: str):
    downloads_dir = get_download_path() 
    proper_dir = os.path.join(downloads_dir, 'data_visualization')
    if not os.path.exists(proper_dir):
        os.mkdir(proper_dir)
    file_path = os.path.join(proper_dir, file_)
    shutil.copyfile(path_, file_path)

    return True 

def edit(path_: str):
    # os.startfile(path_)
    if platform.system() == "Windows":
        os.startfile(path_)
    elif platform.system() == "Darwin":
        subprocess.Popen(['open', path_])
    else: 
        subprocess.Popen(['xdg-open', path_])
    return True 

def delete(path_: str):
    """
    Finds and deletes file_ param
    """
    os.remove(path_)
    updates.main()
    return True 

def main() -> str:
    """
    Main handler
    'True' IF successful ELSE 'False'
    """

    file_ = sys.argv[1]
    action = sys.argv[2]

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
        if action in set(('delete', 'edit')): 
            result = func(path) 
        else: 
            result = func(path, file_)
        if result: 
            return "True"
        else: 
            return "False"

    except Exception as e: 
        return e 


def test() -> str:
    """
    Main handler
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