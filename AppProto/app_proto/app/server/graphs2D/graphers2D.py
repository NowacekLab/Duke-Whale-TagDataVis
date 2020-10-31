"""
MAIN 2D GRAPHERS 
MODULE USED IN graph --> HTML
"""
from plotly import graph_objects as go 
from plotly import express as px 
from plotly.subplots import make_subplots
import pandas as pd
import csv
from typing import List, Tuple
import os 

# EACH FUNCTION UNLESS OTHERWISE SPECIFIED RETURNS [graph object1, graph object2, ...]

def all_graphs(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    # ARBITARY INDICES 
    startIndex, endIndex = indices

    plots = make_subplots(rows=3, cols=2, 
                      subplot_titles=("Heading", "Pitch", 
                                      "X Acceleration", "Roll", "Y Acceleration", "Z Acceleration"))

    headData = df.Heading[startIndex:endIndex]
    plots.add_trace(
        go.Scatter(x=xAxis, y=headData, name = "heading"),
        row=1, col=1
    )

    pitchData = df.Pitch[startIndex:endIndex]
    plots.add_trace(
        go.Scatter(x=xAxis, y=pitchData, name = "pitch"),
        row=1, col=2
    )

    xAccelerationData = df["Accel_X"][startIndex:endIndex]
    plots.add_trace(
        go.Scatter(x=xAxis, y=xAccelerationData, name = "x-acceleration"),
        row=2, col=1
    )

    rollData = df.Roll[startIndex:endIndex] 
    plots.add_trace(
        go.Scatter(x=xAxis, y=rollData, name = "roll"),
        row=2, col=2
    )

    yAccelerationData = df["Accel_Y"][startIndex:endIndex]
    plots.add_trace(
        go.Scatter(x=xAxis, y=yAccelerationData, name = "y-acceleration"),
        row=3, col=1
    )

    zAccelerationData = df["Accel_Z"][startIndex:endIndex]
    plots.add_trace(
        go.Scatter(x=xAxis, y=zAccelerationData, name = "z-acceleration"),
        row=3, col=2
    )

    plots.update_layout(height = 1500, width=1500, title_text="2D Plots")

    return [plots]

def head(df: "data frame", xAxis: List[int], indices: Tuple[int]): 
    startIndex, endIndex = indices

    headData = df.Heading[startIndex:endIndex]
    graph = px.line(x=xAxis, y=headData, labels={'x':'Time', 'y':'Heading'})

    return [graph]

def accelerationX(df: "data frame", xAxis: List[int], indices: Tuple[int]): 
    startIndex, endIndex = indices

    xAccelerationData = df["Accel_X"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=xAccelerationData, labels={'x':'Time', 'y':'Acceleration in the x direction'})

    return [graph]

def accelerationY(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    yAccelerationData = df["Accel_Y"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=yAccelerationData, labels={'x':'Time', 'y':'Acceleration in the y direction'})

    return [graph]

def accelerationZ(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    zAccelerationData = df["Accel_Z"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=zAccelerationData, labels={'x':'Time', 'y':'Acceleration in the z direction'})

    return [graph]

def pitch(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    rollData = df.Roll[startIndex:endIndex]
    graph1 = px.line(x=xAxis, y=rollData, labels={'x':'Time', 'y':'Roll'})

    pitchData = df.Pitch[startIndex:endIndex]
    graph2 = px.line(x=xAxis, y=pitchData, labels={'x':'Time', 'y':'Pitch'})
    
    graph3 = go.Figure()
    graph3.add_trace(go.Scatter(x=xAxis, y=pitchData,
                        mode='lines',
                        name='pitch'))
    graph3.add_trace(go.Scatter(x=xAxis, y=rollData,
                        mode='lines',
                        name='roll'))
    
    return [graph1, graph2, graph3]

CREATORS = [(all_graphs, 'all_graphs.html'), (head, 'heading.html'), (pitch, 'roll.html', 'pitch.html', 'pitchroll.html'), 
            (accelerationX, 'xAccel.html'), (accelerationY, 'yAccel.html'), (accelerationZ, 'zAccel.html')]

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    FILES = os.path.join(BASE_DIR, 'user_files')
    csv_file = os.path.join(FILES, 'eg01_207aprh.csv')

    df = pd.read_csv(csv_file)
    xAxis = list(range(32, 232))
    indices = (32, 232)

    all_graphs(df, xAxis, indices)