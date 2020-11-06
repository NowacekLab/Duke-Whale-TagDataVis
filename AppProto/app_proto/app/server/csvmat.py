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
import json

# CUSTOM
import helper_json
import updates 

import graphs 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_DIR = os.path.join(BASE_DIR, 'user_files')
file_info = os.path.join(BASE_DIR, 'files.json')

def ensure_paths(file_path: str) -> bool: 
    """
    Ensures FILE_DIR, file_info, file_path exist
    """

    # different code than graphs.py, differece between directory, file
    if not os.path.exists(FILE_DIR):
        os.mkdir(FILE_DIR)
    if not os.path.isfile(file_info):
        with open(file_info, 'w') as f: 
            f.write(json.dumps(dict()))

    return os.path.isfile(file_info) and os.path.exists(FILE_DIR) and os.path.isfile(file_path)

def convert(file_path: str, file_: str) -> str:
    """
    Converts given file 
    - Only mat --> csv supported atm 
    """
    try: 
        # 'rb' is necessary, look at https://stackoverflow.com/questions/42339876/error-unicodedecodeerror-utf-8-codec-cant-decode-byte-0xff-in-position-0-in
        with open(file_path, 'rb') as f: 
            data = loadmat(f)

        d = {'fs': data['fs'][0,0], 'Depth': data['p'][:,0], 'Heading': data['head'][:,0], 'Pitch': data['pitch'][:,0], 'Roll': data['roll'][:,0], 'WhaleAccel_X': data['Aw'][:,0], 'WhaleAccel_Y': data['Aw'][:,1], 'WhaleAccel_Z': data['Aw'][:,2], 'Accel_X': data['A'][:,0], 'Accel_Y': data['A'][:,1], 'Accel_Z': data['A'][:,2], 'WhaleMag_X': data['Mw'][:,0], 'WhaleMag_Y': data['Mw'][:,1], 'WhaleMag_Z': data['Mw'][:,2], 'Mag_X': data['M'][:,0], 'Mag_Y': data['M'][:,1], 'Mag_Z': data['M'][:,2]}
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

        if not ensure_paths(file_path):
            raise Exception('user_files directory or files.json does not exist.')

        info = helper_json.read(file_info)
        if not info: 
            info = dict() 

        new_info = dict() 

        if file_.endswith('.csv'): 
            new_info['orig_path'] = file_path 
            conversion_path = file_path
            new_info['csv_path'] = conversion_path 
            new_info['original_name'] = file_
            conversion = file_ 
        elif file_.endswith('.mat'):
            new_info['orig_path'] = file_path 
            conversion_path, conversion = convert(file_path, file_)
            if conversion_path == None: raise Exception("Failed in converting file.")
            new_info['csv_path'] = conversion_path
            new_info['original_name'] = file_ 
        else: 
            raise Exception("Unknown file format.")

        info[conversion] = new_info 

        if not helper_json.create(file_info, info): 
            raise Exception("Failed in final creation of new files.json file.")

        updates.main() 

        if os.path.exists(conversion_path):

            graphs.main(file_=conversion, file_path=conversion_path, action='generate')

            return "True"

        return "False"

    except Exception as e: 
        # print(e) -- enable for dev
        return e

def tester():

    # python3 graphs.py eg01_207aprh.csv /Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/server/user_files/eg01_207aprh.csv generate
    file_path = "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/server/user_files/eg01_207aprh.mat"
    file_ = "eg01_207aprh.mat"

    try:             

        if not ensure_paths(file_path):
            raise Exception('user_files directory or files.json does not exist.')

        info = helper_json.read(file_info)
        if not info: 
            info = dict() 

        new_info = dict() 

        if file_.endswith('.csv'): 
            new_info['orig_path'] = file_path 
            conversion_path = file_path
            new_info['csv_path'] = conversion_path 
            new_info['original_name'] = file_
            conversion = file_ 
        elif file_.endswith('.mat'):
            new_info['orig_path'] = file_path 
            conversion_path, conversion = convert(file_path, file_)
            if conversion_path == None: raise Exception("Failed in converting file.")
            new_info['csv_path'] = conversion_path
            new_info['original_name'] = file_ 
        else: 
            raise Exception("Unknown file format.")

        info[conversion] = new_info 

        if not helper_json.create(file_info, info): 
            raise Exception("Failed in final creation of new files.json file.")

        updates.main() 

        if os.path.exists(conversion_path):

            graphs.main(file_=conversion, file_path=conversion_path, action='generate')

            return json.dumps({
                    'status': "True",
                    'new_file': conversion, 
                    'new_path': conversion_path,
            })

        return json.dumps({
            'status': "False",
            'reason': "Failed conversion or otherwise."
        })

    except Exception as e: 
        # print(e) -- enable for dev
        return json.dumps({
            'status': "False",
            'reason': e,
        })
        # return False 



if __name__ == "__main__":
    print(main())
    # print(tester())
    sys.stdout.flush() 

    # print(tester())