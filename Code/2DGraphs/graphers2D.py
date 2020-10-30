"""
MAIN 2D GRAPHERS 
MODULE USED IN graph --> HTML
"""
import plotly.graph_objects as go
import pandas as pd
import csv
import plotly.express as px
from typing import List, Tuple

# EACH FUNCTION UNLESS OTHERWISE SPECIFIED RETURNS [graph object1, graph object2, ...]

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

CREATORS = [(head, 'heading.html'), (pitch, 'roll.html', 'pitch.html', 'pitchroll.html'), 
            (accelerationX, 'xAccel.html'), (accelerationY, 'yAccel.html'), (accelerationZ, 'zAccel.html')]