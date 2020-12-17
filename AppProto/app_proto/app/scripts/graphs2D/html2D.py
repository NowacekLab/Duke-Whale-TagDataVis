"""
2D GRAPH --> HTML HANDLER 
** INDICES (32 ~ 232) ARE HARD CODED TO DEAL WITH NO VALUES ** 
"""
from typing import List, Tuple
from scipy.io import loadmat 
from scipy.signal import decimate as dc 
from pyquaternion import Quaternion
from plotly import graph_objects as go 
from plotly import express as px
from plotly.offline import plot 
from datetime import datetime 
from multiprocessing import Process 
import numpy as np 
import pandas as pd
import csv
import sys 
import os 
import json
import matplotlib.pyplot as plt 

from .graphers2D import * 
import helper_json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
PRECALCS_DIR = os.path.join(GRAPHS_DIR, 'precalcs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')
SCRIPTS_FILES = os.path.join(BASE_DIR, 'scripts_files')
file_info = os.path.join(SCRIPTS_FILES, 'files.json')

sys.path.append(BASE_DIR)

def create_graph(creator_input: "variable tuple", func: "function", names: List[str], file_: str) -> None:
    """
    Wrapper for the graph functions, writes each to html to reduce code 
    - len(names) == len(List[] return from func)
    """
    graphs = func(*creator_input) 
    for name, graph in zip(names, graphs):
        path_ = os.path.join(GRAPHS_2D_DIR, file_, name)
        graph.write_html(path_)

def save_existing_graphs(file_: str) -> List[str]:
    """
    Hack-y way of doing it... instead of waiting on each process return value
    Just save the existing graphs 
    """
    try: 
        unsaved_graphs, saved_graphs = [], {}

        path_ = os.path.join(GRAPHS_2D_DIR, file_)

        for creator_type in CREATORS: 
            for creator in CREATORS[creator_type]:
                graph_names = list(creator[1:])
                for graph in graph_names: 
                    check_path = os.path.join(path_, graph)

                    if not os.path.isfile(check_path):
                        unsaved_graphs.append(graph)
                        saved_graphs[graph] = ""
                    else:
                        saved_graphs[graph] = check_path
                
        info = helper_json.read(file_info)
        info[file_]['graphs2D'] = saved_graphs
        helper_json.create(file_info, info) 

        return unsaved_graphs
    except Exception as e:
        print(e)

def exist_calculations(file_: str, calc_file: str) -> bool: 
    """
    Checks if pre-calculations already exist 
    """
    try: 
        info = helper_json.read(file_info)
        if not 'extra' in info[file_]: 
            return False 
        return calc_file in info[file_]['extra']
    except Exception as e: 
        print(e)
        return False

def get_calculations(file_: str, calc_file: str): 
    """
    Returns pre-calculations file path 
    """
    try: 
        if not exist_calculations(file_, calc_file): return None 
        info = helper_json.read(file_info)
        return info[file_]['extra'][calc_file]
    except Exception as e: 
        return None 

def save_calculations(file_: str, calc_file: str, data: "dataframe") -> bool:
    """
    False IF fail, True IF success
    """
    try: 
        info = helper_json.read(file_info)
        if not os.path.isdir(PRECALCS_DIR): 
            os.mkdir(PRECALCS_DIR)
        calc_file_path = os.path.join(PRECALCS_DIR, calc_file)
        data.to_csv(calc_file_path)
        if not 'extra' in info[file_]:
            info[file_]['extra'] = {} 
        info[file_]['extra'][calc_file] = calc_file_path
        helper_json.create(file_info, info)

        return True 
    except Exception as e: 
        print(e) 
        return False 

def pre_calculations(file_: str, file_path: str, calc_file: str):
    """
    PRECALCULATE REUSED DATA 
    """
    if exist_calculations(file_, calc_file): return 

    csv = pd.read_csv(file_path)
    data = csv.to_dict(orient = 'list')
    roll = np.array(data['Roll'])
    pitch = np.array(data['Pitch'])
    yaw = np.array(data['Heading'])
    depth = np.array(data['Depth']) * -1
    accel_x = np.array(data['WhaleAccel_X']) * 9.81 # X Data in m/s^2
    accel_y = np.array(data['WhaleAccel_Y']) * 9.81 # Y Data in m/s^2
    accel_z = np.array(data['WhaleAccel_Z']) * 9.81 # Z Data in m/s^2
    length = len(accel_x)
    v = 2.2 #Initial velocity in xW, yW, zW
    dx = np.zeros([length + 1, 2]) #Initial displacement in x, y
    fs = 1/50
    t = np.linspace(0, length * fs, length + 1)
    forward_vec = np.array([1, 0, 0])

    #initialize jerk as 3-d 0 vectors
    j=np.zeros([length , 3])
    
    for i in range(length):
        rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
        pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
        yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
        rotateq = (yawq * pitchq * rollq)
        direc = rotateq.rotate(forward_vec)
        project_vec = np.array([direc[0], direc[1], 0])
        angle = np.arccos(np.dot(direc, project_vec) / (np.linalg.norm(project_vec)))
        dv = v * np.sin(angle)
        #Calculate new displacement for the current step
        dx[i + 1] = [(dv * np.cos(yaw[i])) * fs + dx[i][0], (dv * np.sin(yaw[i])) * fs + dx[i][1]]

        #fill in jerk for each step, skip first step & leave it as 0
        if (i!=0):
            j[i]=[(accel_x[i]-accel_x[i-1])/fs,(accel_y[i]-accel_y[i-1])/fs,(accel_z[i]-accel_z[i-1])/fs]

    csv['X Position'] = dx[:-1, 0]
    csv['Y Position'] = dx[:-1, 1]
    csv['Z Position'] = depth
    
    csv['Jerk_X'] = j[:,0]
    csv['Jerk_Y'] = j[:,1]
    csv['Jerk_Z'] = j[:,2]
    # csv.to_csv('.'.join(filename.split('.')[0:-1]) + '_calculations.csv', index = False)
    return save_calculations(file_, calc_file, csv)

def main(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    Main handler 
    """
    try: 
        calc_file = f"{''.join(file_.split('.')[:-1])}_precalc.csv"
        pre_calculations(file_, file_path, calc_file)
        calc_file_path = get_calculations(file_, calc_file)

        df = pd.read_csv(file_path)
        precalc_df = pd.read_csv(calc_file_path)

        # arbitrary for this set of graphs -- TAKE A LOOK AT THIS 
        startIndex = 32
        endIndex = 232

        xAxis = list(range(startIndex, endIndex)) 
        indices = (startIndex, endIndex)

        all_processes = [] 

        total_graphs = 0 

        creator_inputs = {
            'STANDARD': [df, xAxis, indices],
            'PRECALC_DF': [precalc_df, xAxis, indices],
            'STANDARD_ONLY_DF': [df]
        }

        # multiprocessing 
        for creator_type in CREATORS: 
            creator_input = creator_inputs[creator_type]
            for creator in CREATORS[creator_type]:
                func = creator[0]
                names = list(creator[1:])
                total_graphs += len(names)
                p = Process(target=create_graph, args=(creator_input, func, names, file_))
                all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 
        
        unsaved_graphs = save_existing_graphs(file_)

        if total_graphs == len(unsaved_graphs):
            return (False, [])
        
        return (True, unsaved_graphs)
    except Exception as e:
        return (False, [])

def test(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    TEST of MAIN handler 
    """
    try: 
        df = pd.read_csv(file_path)

        # arbitrary for this set of graphs
        startIndex = 32
        endIndex = 232

        xAxis = list(range(startIndex, endIndex))
        indices = (startIndex, endIndex)


        all_processes = [] 

        # multiprocessing
        for creator in CREATORS: # 'CREATORS' MUST conform to create_graph params/args 
            func = creator[0]
            names = list(creator[1:])
            p = Process(target=create_graph, args=(df, xAxis, indices, func, names, file_))
            all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 

        unsaved_graphs = [] 

        return (True, unsaved_graphs)
    except Exception as e:
        return (False, [])


if __name__ == "__main__":
    # this is only testing -- this module is only really called via the 'main()' function 
    # print(main('mn17_005aprh25.mat.csv', 'mn17_005aprh25.mat.csv'))
    # sys.stdout.flush()

    print('hi')