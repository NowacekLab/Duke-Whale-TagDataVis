"""
3D GRAPH --> HTML HANDLER 
"""
from typing import List, Tuple
from scipy.io import loadmat
from scipy.signal import decimate as dc
from pyquaternion import Quaternion
from plotly import graph_objects as go 
from plotly import express as px
from plotly.offline import plot
from multiprocessing import Process 
from datetime import datetime
import numpy as np
import pandas as pd
import csv
import sys 
import os 
import json
import matplotlib.pyplot as plt

from .graphers3D import * 
import helper_json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
PRECALCS_DIR = os.path.join(GRAPHS_DIR, 'precalcs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')
SCRIPTS_FILES = os.path.join(BASE_DIR, 'scripts_files')
file_info = os.path.join(SCRIPTS_FILES, 'files.json')

sys.path.append(BASE_DIR)

def create_graph(file_: str, calc_file_path: str, func: "function", names: List[str]) -> None:
    """
    Wrapper for the graph functions, writes each to html to reduce code 
    - len(names) == len(List[] return from func)
    """
    graphs = func(calc_file_path)
    for name, graph in zip(names, graphs):
        path_ = os.path.join(GRAPHS_3D_DIR, file_, name)
        graph.write_html(path_)

def save_existing_graphs(file_: str) -> List[str]:
    """
    Hack-y way of doing it... instead of waiting on each process return value
    Just save the existing graphs 
    """
    try: 
        unsaved_graphs, saved_graphs = [], {}

        path_ = os.path.join(GRAPHS_3D_DIR, file_)

        for creator in CREATORS: 
            graph_names = list(creator[1:])
            for graph in graph_names: 
                check_path = os.path.join(path_, graph)

                if not os.path.isfile(check_path):
                    unsaved_graphs.append(graph)
                    saved_graphs[graph] = ""
                else: 
                    saved_graphs[graph] = check_path
                
        info = helper_json.read(file_info)
        info[file_]['graphs3D'] = saved_graphs
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

def main(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    Main handler 
    """
    try: 
        calc_file = f"{''.join(file_.split('.')[:-1])}_precalc.csv"
        calc_file_path = get_calculations(file_, calc_file)

        all_processes = [] 

        total_graphs = 0

        # multiprocessing
        for creator in CREATORS: # 'CREATORS' MUST conform to create_graph params/args 
            func = creator[0]
            names = list(creator[1:])
            total_graphs += len(names)
            p = Process(target=create_graph, args=(file_, calc_file_path, func, names))
            all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 
        
        unsaved_graphs = save_existing_graphs(file_)

        if len(unsaved_graphs) == total_graphs:
            return (False, [])
        
        return (True, unsaved_graphs)
    except Exception as e:
        print(e) 
        return (False, [])

def test(file_: str, file_path: str): # similar to above without save_existing_graphs
    try:   
        all_processes = [] 

        # multiprocessing
        for creator in CREATORS: # 'CREATORS' MUST conform to create_graph params/args 
            func = creator[0]
            names = list(creator[1:])
            p = Process(target=create_graph, args=(file_, file_path, func, names))
            all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 

    except Exception as e: 
        print(e) 

def test2():
    path_ = "C:\\Users\\joonl\\CODING\\Data-Visualization-MAPS\\AppProto\\app_proto\\app\\server\\user_files\\eg01_207aprh.csv"
    graphs = trackplot(path_)
    graph = graphs[0]
    graph.show()

if __name__ == "__main__":
    # this is only testing -- this module is only really called via the 'main()' function 
    # print(main('mn17_005aprh25.mat.csv', 'mn17_005aprh25.mat.csv'))
    # sys.stdout.flush()

    # print(BASE_DIR)
    # test("eg01_207aprh.csv", "/Users/joonyounglee/DATA_VIS/Data-Visualization-MAPS/AppProto/app_proto/app/server/user_files/eg01_207aprh.csv")
    pass 