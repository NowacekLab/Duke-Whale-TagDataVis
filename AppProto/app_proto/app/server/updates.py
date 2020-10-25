import os 
import sys 
import time 

import helper_json

BASE_DIR = os.path.dirname(__file__)
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
file_info = os.path.join(BASE_DIR, 'files.json')

def humansize(nbytes):
    """
    Converts memory in bytes to human-readable format 
    """
    suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    i = 0
    while nbytes >= 1024 and i < len(suffixes)-1:
        nbytes /= 1024.
        i += 1
    f = ('%.2f' % nbytes).rstrip('0').rstrip('.')
    return '%s %s' % (f, suffixes[i])

def file_exists(file_: str, info: dict) -> bool: 
    """
    Updates info dict 
    Removes file if it does not exist 
    True IF changes ELSE False 
    """
    try: 
        path1 = info[file_]["orig_path"]
        path2 = info[file_]["csv_path"]
        if any(not os.path.exists(path) for path in (path1, path2)):
            info[file_] = None 
            return True 
        return False 
    except: 
        return False 

def memory_update(file_: str, info: dict) -> bool: 
    """
    Updates memory associated with file // memory is the ORIGINAL file memory 
    True IF changes ELSE False
    """
    try: 
        path1 = info[file_]["orig_path"]
        memory = humansize(int(os.path.getsize(path1)))
        try: 
            orig_memory = info[file_]["size"]
            if orig_memory != memory: 
                info[file_]["size"] = memory 
                return True 
        except: 
            info[file_]["size"] = memory 
            return True 
        return False 
    except:
        return False 

def modified_update(file_: str, info: dict) -> bool: 
    """
    Updates modified date associated with file  // modified date is ORIGINAL file 
    True IF changes ELSE False
    """
    try: 
        path1 = info[file_]["orig_path"]
        date = time.strftime("%m/%d/%Y %I:%M:%S %p", time.localtime(os.path.getmtime(path1)))
        try: 
            orig_date = info[file_]["modified"]
            if orig_date != date: 
                info[file_]["modified"] = date 
                return True 
        except: 
            info[file_]["modified"] = date 
            return True 
        return False
    except: 
        return False 

def all_updates(info: dict) -> bool: 
    """
    Handles all updates
    """
    changes = False 
    updaters = [file_exists, memory_update, modified_update]
    for file_ in info: 
        for updater in updaters: 
            if updater(file_, info):
                changes = True 
    if changes: 
        removals = [] 
        for file_ in info:
            if info[file_] == None: 
                removals.append(file_)
        for removal in removals: 
            try: 
                info.pop(removal)
            except: 
                pass 
        helper_json.create(file_info, info)
    return changes 

def main():
    info = helper_json.read(file_info)
    return all_updates(info) # update/validate files in files.json

if __name__ == "__main__":
    print(main())
    sys.stdout.flush()