"""
2D GRAPH --> HTML HANDLER 
** INDICES (32 ~ 232) ARE HARD CODED TO DEAL WITH NO VALUES ** 
"""

from plotly import graph_objects as go 
from plotly import express as px
import pandas as pd
import csv
import sys 
from multiprocessing import Process 
from typing import List, Tuple
import os 
import json

from .graphers2D import * 
import helper_json

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')
file_info = os.path.join(BASE_DIR, 'files.json')

sys.path.append(BASE_DIR)

def create_graph(df: "data frame", xAxis: List[int], indices: Tuple[int], func: "function", names: List[str], file_: str) -> None:
    """
    Wrapper for the graph functions, writes each to html to reduce code 
    - len(names) == len(List[] return from func)
    """
    graphs = func(df, xAxis, indices) 
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
        info[file_]['graphs2D'] = saved_graphs
        helper_json.create(file_info, info) 

        return unsaved_graphs
    except Exception as e:
        print(e)

def main(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    Main handler 
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
        
        unsaved_graphs = save_existing_graphs(file_)
        
        return (True, unsaved_graphs)
    except Exception as e:
        return (False, [])

if __name__ == "__main__":
    print(main('mn17_005aprh25.mat.csv', 'mn17_005aprh25.mat.csv'))
    sys.stdout.flush()