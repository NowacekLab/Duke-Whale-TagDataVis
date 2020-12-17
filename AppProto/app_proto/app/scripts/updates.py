import os 
import shutil
import sys 
import time 

import helper_json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')

SCRIPTS_FILES = os.path.join(BASE_DIR, 'scripts_files')
file_info = os.path.join(SCRIPTS_FILES, 'files.json')

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
        path1 = info[file_]["csv_path"]
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
        path1 = info[file_]["csv_path"]
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

def html_deleted(info: dict) -> bool: 
    """
    Updates info for deleted html file
    """
    changes = False 
    for file_ in info: # yes... the object nesting takes this much to traverse
        for graph_type in ('graphs2D', 'graphs3D'):
            if graph_type in info[file_]:
                modified = info[file_][graph_type].copy()
                for graph in info[file_][graph_type]:
                    graph_path = info[file_][graph_type][graph]
                    if (not os.path.isfile(os.path.join(GRAPHS_2D_DIR, graph_path)) or not os.path.isfile(os.path.join(GRAPHS_3D_DIR, graph_path))):
                        modified.pop(graph)
                        changes = True
                info[file_][graph_type] = modified 
    helper_json.create(file_info, info)
    return changes 

def clear_files(path_: str, info: dict) -> None: 
    """
    Cleares all files associated with deleted .csv file
    (e.g. graphs)
    """
    # csv_path 
    chosen_file = None 
    for file_ in info: 
        if 'csv_path' in info[file_] and info[file_]['csv_path'] == path_: 
            chosen_file = file_ 
            break 
    if chosen_file != None: 
        for directory in (GRAPHS_2D_DIR, GRAPHS_3D_DIR):
            file_directory = os.path.join(directory, chosen_file)
            if os.path.isdir(file_directory):
                shutil.rmtree(file_directory) # this forces removal 
        if 'extra' in info[chosen_file]:
            for extra in info[chosen_file]['extra']:
                extra_path = info[chosen_file]['extra'][extra]
                if os.path.isfile(extra_path): 
                    os.remove(extra_path)
                elif os.path.isdir(extra_path):
                    shutil.rmtree(extra_path)

def main(html_=False, path_=None): # html_ TRUE .html file-related update 
    info = helper_json.read(file_info)
    if html_: 
        return html_deleted(info)
    else: 
        if path_ != None and path_.endswith('csv'): # clear .csv file graphs 
            clear_files(path_, info)
        return all_updates(info) # update/validate files in files.json

if __name__ == "__main__":
    # print(main())
    # sys.stdout.flush()
    print(main(False, path_="C:\\Users\\joonl\\CODING\\Data-Visualization-MAPS\\AppProto\\app_proto\\app\\server\\user_files\\eg01_207aprh.csv"))