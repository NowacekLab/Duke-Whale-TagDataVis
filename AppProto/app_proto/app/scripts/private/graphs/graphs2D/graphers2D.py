"""
2D Graphers called in html2D.py
"""
from typing import List, Tuple
from plotly import graph_objects as go
from plotly import express as px
from plotly.subplots import make_subplots
from scipy import signal as sg
from plotly.offline import plot
from ipywidgets import widgets
from datetime import datetime
import pandas as pd
import csv
import os
import numpy as np

from private.logs import logDecorator 
from private.helpers import kwargsHelper

MODULE_NAME = "graphers2D"

genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog
def plot_POI(df: "data frame"):
    """
    This graph, like the one below it, does not
    use the xAxis nor indices params, only there
    as part of graph creation standardization
    """


    # Pull Specific Variables
    fs = df['fs'].tolist()[0]
    head = df['Heading'].tolist()
    p = df['Depth'].tolist()
    roll = df['Roll'].tolist()
    pitch = df['Pitch'].tolist()

    # Calculate time
    numData = len(p)
    t = [x/fs for x in range(numData)]
    t_hr = [x/3600 for x in t]

    # Scaling Factor to reduce amount of data
    scale = 10

    # Reduce Data
    sP = sg.decimate(p,scale).copy()
    sRoll = sg.decimate(roll,scale).copy()
    sPitch = sg.decimate(pitch,scale).copy()
    sHead = sg.decimate(head,scale).copy()

    # Calculate Reduced time
    numData = len(sP)
    sT = [x/(fs/scale) for x in range(numData)]
    sT_hr = [x/3600 for x in sT]

    tView = 10 # seconds
    N = int(fs*tView/2) # Number of points

    # Create a list of Points of Interest
    xPOI = [1, 1.5, 2.2] #hour
    # Empty list for y coordinates of points of interest to be populated
    yPOI = []


    #Create zoomed in x and y data sets
    zoomT = [[] for x in range(len(xPOI))]
    zoomP = [[] for x in range(len(xPOI))]
    zoomR = [[] for x in range(len(xPOI))]

    # Create a set of Data for each of the points of interest
    for k in range(len(xPOI)):
        ind = 3600*xPOI[k]*fs # Get starting Index
        # Add y of Points of Interest
        yPOI.append(p[int(ind)])

        # Zoomed Data
        xdata = p
        # Create a range of indexes across tView centered on the point selected
        # Must take into account end conditions
        if ind < int(tView/2)*fs:
            indRange = np.arange(0, int(tView)*fs, 1)
        elif ind > len(xdata) - int(tView/2)*fs - 1:
            indRange = np.arange(len(xdata)-1-(tView)*fs, len(xdata)-1, 1)
        else:
            indRange = np.arange(int(ind - tView/2*fs), int(ind + tView/2*fs), 1)
        # Loop through indRange and add data to respective points of interest
        for i in indRange:
            # Select even indexs to reduce animation time
            if i%2 == 0:
                zoomT[k].append(t_hr[i])
                zoomP[k].append(p[i])
                rollL = [roll[i], roll[i], (roll[i]+90), roll[i]+180, roll[i], roll[i]+180]
                zoomR[k].append(rollL)

    # fig = go.FigureWidget(make_subplots(
    fig = go.Figure(make_subplots(
        rows = 2, cols=2,
        # Define what plot goes where and the type of plot
        specs = [[{"rowspan":2},{"type":"polar"}],
                [None, {}]]
        )
        )

    # Add traces to Figure
    trace = go.Scattergl(x=sT_hr, y=sP, mode='lines', name = "Depth")
    fig.add_trace(trace, row = 1, col = 1)
    fig.add_trace(go.Scattergl(x = xPOI, y = yPOI, mode = 'markers',
                            marker = dict(color = 'green', symbol = 'square', size = 10),
                            name = "Points of Interest"), row = 1, col = 1)

    # Loop through points of interest and create traces for each for the subplots
    for k in range(len(xPOI)):
        nameK = "Depth of POI " + str(k)
        # Polar Plot
        fig.add_trace(go.Scatterpolar(r = [1, 0.25, 0.25, 0.25, 0.25, 1], theta = zoomR[k][0], mode = "lines", visible = False), row = 1, col = 2)
        # Zoomed Depth Plot
        fig.add_trace(go.Scattergl(x = zoomT[k], y = zoomP[k], mode = "lines", visible = False, name = nameK), row = 2, col = 2)
        # Third Trace is for animation purposes
        fig.add_trace(go.Scattergl(x= [], y = [], mode = 'markers', marker = dict(color="red", size = 10), visible = False), row = 2, col = 2)

    '''
    Update the layout of subplots
    Have to go axis by axis
    '''
    # Update x-axis
    fig.update_xaxes(title_text = "Time (hr)", row = 1, col = 1)
    fig.update_xaxes(title_text = "Time (hr)", row = 1, col = 2)

    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 2, col = 2)

    # Create Button list based on POI
    # Add the initial play button for animation
    buttonList = [dict(label="Play",
                            method="animate",
                            args=[None]
                        )]
    # Create a "visible" list for button creation based on number of POI
    visibleList = [False]*(2 + 3*len(xPOI))
    # The first two traces will always be visible
    visibleList[0] = True
    visibleList[1] = True
    # Add a None button
    buttonList.append(dict(label = 'None',
                            method = 'update',
                            args = [{'visible': visibleList},
                                    {'title': 'No Selected Point',
                                    'showlegend':True}]
                        ))
    # Loop through POI and add buttons
    for k in range(len(xPOI)):
        labelK  = "POI " + str(k)
        titleK = "POI " + str(k) + " Selected"
        # Copy visible list
        visibleListK = visibleList.copy()
        # Create a list of the indexes of the traces associated with xPOI[k]
        inds = [2+(3*k), 3+(3*k), 4+(3*k)]
        # Flip visibilities to True
        for i in inds:
            visibleListK[i] = True
        # Add button
        buttonList.append(dict(label = labelK,
                            method = 'update',
                            args = [{'visible': visibleListK},
                                    {'title': titleK,
                                    'showlegend':True}]
                        ))

    # Update Entire Fig Layout
    fig.update_layout(
            title="Select Point of Interest",
            # Add in buttons to select which point of interest to display
            updatemenus=[dict(
                type="buttons",
                buttons = buttonList
            )]
    )

    return [fig]

@genericLog
def plot_timeline(df: "data frame"):
    """
    Note that this graph does not use xAxis nor indices params
    Only there as part of graph standardization in creating
    """

    # Pull Specific Variables
    fs = df['fs'].tolist()[0]
    head = df['Heading'].tolist()
    p = df['Depth'].tolist()
    roll = df['Roll'].tolist()
    pitch = df['Pitch'].tolist()
    # Calculate time
    numData = len(p)
    t = [x/fs for x in range(numData)]
    t_hr = [x/3600 for x in t]

    '''
    Added code to reduce the lag of the Figure
    '''
    # Scaling Factor to reduce amount of data
    # A factor of 10 will reduce the data for example from 50 Hz to 5 Hz
    scale = 10

    # Reduce Data
    sP = sg.decimate(p,scale).copy()
    sRoll = sg.decimate(roll,scale).copy()
    sPitch = sg.decimate(pitch,scale).copy()
    sHead = sg.decimate(head,scale).copy()

    # Calculate time - Reduced
    numData = len(sP)
    sT = [x/(fs/scale) for x in range(numData)]
    sT_hr = [x/3600 for x in sT]

    # Make Widget Figure
    fig = go.Figure(
            make_subplots(
                # Deifne dimensions of subplot
                rows = 2, cols=1,
                # Define what plot goes where and the type of plot
                specs = [[{}],
                        [{}]],
                shared_xaxes = True
            )
        )

    # Create traces for the data and add to figure
    fig.add_trace(go.Scattergl(x = sT_hr, y = sP, mode = "lines", name = "Depth"), row = 1, col = 1)
    fig.add_trace(go.Scattergl(x = sT_hr, y = sHead, mode = "lines", name = "Head"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = sT_hr, y = sPitch, mode = "lines", name = "Pitch"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = sT_hr, y = sRoll, mode = "lines", name = "Roll" ), row = 2, col = 1)

    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = 2, col = 1)
    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)

    return [fig]

# ! skipping this because it did not work
@genericLog
def all_graphs_sep(df: "data frame", xAxis: List[int], indices: Tuple[int]):
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

@genericLog
def head(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    headData = df.Heading[startIndex:endIndex]
    graph = px.line(x=xAxis, y=headData, labels={'x':'Time', 'y':'Heading'})

    return [graph]

@genericLog
def accelerationX(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    xAccelerationData = df["Accel_X"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=xAccelerationData, labels={'x':'Time', 'y':'Acceleration in the x direction'})

    return [graph]

@genericLog
def accelerationY(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    yAccelerationData = df["Accel_Y"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=yAccelerationData, labels={'x':'Time', 'y':'Acceleration in the y direction'})

    return [graph]

@genericLog
def accelerationZ(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    zAccelerationData = df["Accel_Z"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=zAccelerationData, labels={'x':'Time', 'y':'Acceleration in the z direction'})

    return [graph]

@genericLog
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

"""
  Three added Jerk plots
  Input df has to be to from "...._calculations.csv"
"""

@genericLog
def jerkX(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    xJerkData = df["Jerk_X"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=xJerkData, labels={'x':'Time', 'y':'Jerk in the x direction'})

    return [graph]

@genericLog
def jerkY(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    yJerkData = df["Jerk_Y"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=yJerkData, labels={'x':'Time', 'y':'Jerk in the y direction'})

    return [graph]

@genericLog
def jerkZ(df: "data frame", xAxis: List[int], indices: Tuple[int]):
    startIndex, endIndex = indices

    zJerkData = df["Jerk_Z"][startIndex:endIndex]
    graph = px.line(x=xAxis, y=zJerkData, labels={'x':'Time', 'y':'Jerk in the z direction'})

    return [graph]


DATA_AXIS_INDICES_KWARG = kwargsHelper.getGrapherDataAxisIndicesKwarg()
PRECALC_AXIS_INDICES_KWARG = kwargsHelper.getGrapherPreCalcAxisIndicesKwarg()
DATA_FILE_KWARG = kwargsHelper.getGrapherDataFileKwarg()

GRAPHERS = {
    DATA_AXIS_INDICES_KWARG: [(head, 'heading.html'),
            (pitch, 'roll.html', 'pitch.html', 'pitchroll.html'), (accelerationX, 'xAccel.html'),
            (accelerationY, 'yAccel.html'), (accelerationZ, 'zAccel.html')],
    PRECALC_AXIS_INDICES_KWARG: [(jerkX,'xJerk.html'),
            (jerkY,'yJerk.html'),(jerkZ,'zJerk.html')],
    DATA_FILE_KWARG: [(plot_POI, 'plot_POI.html'), (plot_timeline, 'plot_timeline.html')]
}