"""
MAT --> CSV converter module (FOR DEVELOPMENT ATM)
- files.json MUST exist 
- module does not do much error checking 
"""
import helper_json
import os 
import pandas as pd
from scipy.io import loadmat
import sys 
import time 

BASE_DIR = os.path.dirname(__file__)
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
file_info = os.path.join(BASE_DIR, 'files.json')

def convert(file_path: str, file_: str) -> str:
    """
    Converts given file 
    - Only mat --> csv supported atm 
    """
    try: 
        # 'rb' is necessary, look at https://stackoverflow.com/questions/42339876/error-unicodedecodeerror-utf-8-codec-cant-decode-byte-0xff-in-position-0-in
        with open(file_path, 'rb') as f: 
            data = loadmat(f)

        d = {'Heading': data['head'][:,0], 'Pitch': data['pitch'][:,0], 'Roll': data['roll'][:,0], 'Accel_X': data['Aw'][:,0], 'Accel_Y': data['Aw'][:,1], 'Accel_Z': data['Aw'][:,2]}
        df = pd.DataFrame(data=d)

        orig_name = file_.split(".mat")[0]
        new_name = orig_name + ".csv"
        new_path = os.path.join(FILE_DIR, new_name)
        df.to_csv(new_path, index = False)
        
        return new_path  

    except Exception as e:
        print(e)  
        return 


def files_exist(info: dict) -> bool: 
    """
    Checks whether all files in files.json exist 
    """

    for file_ in info: 
        file_path = os.path.join(FILE_DIR, file_)
        if not os.path.exists(file_path):
            return False 
    return True 

def main() -> str:
    """
    Main handler 
    - 'True' IF successful, ELSE 'False'
    """

    file_path = sys.argv[1] 
    file_ = sys.argv[2]

    try: 
        info = helper_json.read(file_info)
        if not info: 
            # raise Exception("Failed to read files.json.")
            info = dict() 

        # if not files_exist(info): raise Exception("File(s) in files.json do not exist in user_files dir.")


        # for file_ in info: 
        #     if info[file_] == None or info[file_] == 'None':
        #         conversion = convert(file_)
        #         if conversion != None:
        #             info[file_] = conversion
        #         else: 
        #             print(f"Failed converting {file_}")

        new_info = dict() 

        if file_.endswith('.csv'): 
            new_info['orig_path'] = file_path 
            conversion = file_path
            new_info['csv_path'] = conversion 
            info[file_] = new_info

        elif file_.endswith('.mat'):
            new_info['orig_path'] = file_path 
            conversion = convert(file_path, file_)
            new_info['csv_path'] = conversion 
            if conversion != None: 
                info[file_] = new_info  
            else: 
                raise Exception() 

        else: 
            raise Exception("Unknown file format.")

        if not helper_json.create(file_info, info): 
            raise Exception("Failed in final creation of new files.json file.")

        timeout = 60 # 1 minute until time out -- arbitrary
        timeout_start = time.time() 
        while time.time() < timeout_start + timeout: 
            if os.path.exists(conversion):
                return "True"

        # 'Timeout' LIKELY is due to taking over a minute to process the file 
        return "Timeout"

    except Exception as e: 
        # print(e) -- enable for dev
        print(e) 
        return "False" 

def test():

    arg = sys.argv[1]
    print(arg)
    sys.stdout.flush() 

if __name__ == "__main__":
    print(main())
    # test() 
    sys.stdout.flush() 