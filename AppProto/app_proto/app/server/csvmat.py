"""
MAT --> CSV converter module (FOR DEVELOPMENT ATM)
- files.json MUST exist 
- module does not do much error checking 
"""
import os 
import pandas as pd
from scipy.io import loadmat
import sys 
import time 

# CUSTOM
import helper_json
import updates 

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
        
        return (new_path, new_name)

    except Exception as e:
        return e 

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
            info = dict() 

        new_info = dict() 

        if file_.endswith('.csv'): 
            new_info['orig_path'] = file_path 
            conversion_path = file_path
            new_info['csv_path'] = conversion_path 
            new_info['converted_name'] = file_
        elif file_.endswith('.mat'):
            new_info['orig_path'] = file_path 
            conversion_path, conversion = convert(file_path, file_)
            if conversion_path == None: raise Exception("Failed in converting file.")
            new_info['csv_path'] = conversion_path
            new_info['converted_name'] = conversion
        else: 
            raise Exception("Unknown file format.")

        info[file_] = new_info 

        if not helper_json.create(file_info, info): 
            raise Exception("Failed in final creation of new files.json file.")

        updates.main() 

        timeout = 60 # 1 minute until time out -- arbitrary
        timeout_start = time.time() 
        while time.time() < timeout_start + timeout: 
            if os.path.exists(conversion_path):
                return "True"

        # 'Timeout' LIKELY is due to taking over a minute to process the file 
        return "Timeout"

    except Exception as e: 
        # print(e) -- enable for dev
        return e 
        # return False 

if __name__ == "__main__":
    print(main())
    # test() 
    sys.stdout.flush() 