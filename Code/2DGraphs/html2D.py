"""
2D GRAPH --> HTML HANDLER 
** INDICES (32 ~ 232) ARE HARD CODED TO DEAL WITH NO VALUES ** 
"""

import plotly.graph_objects as go
import pandas as pd
import csv
import plotly.express as px
import sys 
from multiprocessing import Process 
from typing import List, Tuple

from graphers2D import * 

def create_graph(df: "data frame", xAxis: List[int], indices: Tuple[int], func: "function", names = List[str]) -> None:
    """
    Wrapper for the graph functions, writes each to html to reduce code 
    - len(names) == len(List[] return from func)
    """
    graphs = func(df, xAxis, indices) 
    for name, graph in zip(names, graphs):
        graph.write_html(name)

def main(file_: str, file_path: str) -> None: 
    """
    Main handler 
    """

    df = pd.read_csv(file_path)

    # arbitrary for this set of graphs
    startIndex = 32
    endIndex = 232

    xAxis = list(range(startIndex, endIndex))
    indices = (startIndex, endIndex)

    # multiprocessing
    for creator in CREATORS: # 'CREATORS' MUST conform to create_graph params/args 
        func = creator[0]
        names = list(creator[1:])
        p = Process(target=create_graph, args=(df, xAxis, indices, func, names,))
        p.start() 

if __name__ == "__main__":
    print(main('mn17_005aprh25.mat.csv', 'mn17_005aprh25.mat.csv'))
    sys.stdout.flush()