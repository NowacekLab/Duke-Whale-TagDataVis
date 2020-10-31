'''
Author: Mitchell 
2D Plot
Figure contains two subplots: 
    1. A depth plot 
    2. A plot with roll pitch and head 
Can click on elements of legend to hide them
A slider is positioned between the subplots to dictate the range of time
'''


# from scipy.io import loadmat# pip installed scipy
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import scipy.signal as sg
# pip install ipywidgets
from plotly.offline import plot
from plotly.subplots import make_subplots
from ipywidgets import widgets
from datetime import datetime

def plot2D(filename):
    # Pull in Data
    data = pd.read_csv(filename)

    # Pull Specific Variables
    fs = data['fs'].tolist()[0]
    head = data['head'].tolist()
    p = data['p'].tolist()
    roll = data['roll'].tolist()
    pitch = data['pitch'].tolist()
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

    # Show figure and save as an HTML
    fig.show()

    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_demoPlot2D.html')

if __name__ == '__main__':
    plot2D('../Pm19_136aprh.csv')