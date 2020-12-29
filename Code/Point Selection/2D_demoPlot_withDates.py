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
# from datetime import datetime
# Imports from calculations
import datetime
import re

'''
Pulled the start time function from the calculation.py
'''
#Calculate Tag Start Time
def logProcessStarttime(logname):
    ext = logname.split('.')[-1]
    if ext == 'txt':
        log = open(logname, 'r').read()
        intTime = int(re.findall('[0-9a-f]{8}', log)[0], 16)
        originTime = datetime.datetime(1900, 1, 1, 0, 0, 0)
        deltaTime = datetime.timedelta(seconds = intTime)
        startTime = originTime + deltaTime + datetime.timedelta(hours = 4) #HARDCODED FROM UTC-4 TO UTC
    elif ext == 'xml':
        DOMTree = xml.dom.minidom.parse(logname)
        collection = DOMTree.documentElement
        collection.getElementsByTagName("EVENT")
        dateStr = collection.getElementsByTagName("EVENT")[0].getAttribute('TIME')
        startTime = datetime.datetime.strptime(dateStr, '%Y,%m,%d,%H,%M,%S')
    else:
        print('Log filetype error: only .xml and .txt expected')
        return 0
    return startTime


def plot2D(filename, logname):
    # Pull in Data
    data = pd.read_csv(filename)

    # Pull Specific Variables
    fs = data['fs'].tolist()[0]
    head = data['Heading'].tolist()
    head = [x*180/np.pi for x in head]
    p = data['Depth'].tolist()
    roll = data['Roll'].tolist()
    roll = [x*180/np.pi for x in roll]
    pitch = data['Pitch'].tolist()
    pitch = [x*180/np.pi for x in pitch]

    # Calculate time 
    numData = len(p)
    startTime = logProcessStarttime(logname)
    t = [startTime + datetime.timedelta(0, x/fs) for x in range(numData)]
    

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
    sT = [startTime + datetime.timedelta(0, x/(fs/scale)) for x in range(numData)]
    

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
    fig.add_trace(go.Scattergl(x = sT, y = sP, mode = "lines", name = "Depth"), row = 1, col = 1) 
    fig.add_trace(go.Scattergl(x = sT, y = sHead, mode = "lines", name = "Head"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = sT, y = sPitch, mode = "lines", name = "Pitch"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = sT, y = sRoll, mode = "lines", name = "Roll" ), row = 2, col = 1)

    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", row = 2, col = 1)

    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)
    fig.update_yaxes(title = "Degrees", row = 2, col = 1)

    fig.update_layout(xaxis=dict(
        rangeselector=dict(
            buttons=list([
                dict(count=1,
                     label="1 hr",
                     step="hour",
                     stepmode="backward"),
                dict(count=30,
                     label="30 min",
                     step="minute",
                     stepmode="backward"),
                dict(count=10,
                     label="10 min",
                     step="minute",
                     stepmode="backward"),
                dict(count=1,
                     label="1 min",
                     step="minute",
                     stepmode="backward"),
                dict(count=30,
                     label="30 sec",
                     step="second",
                     stepmode="backward"),
                dict(step="all")
            ])
        ),
        rangeslider=dict(
            visible=True
        ),
        type="date"
    ))

    # Show figure and save as an HTML
    fig.show()

    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_demoPlot2D.html')

if __name__ == '__main__':
    filename = '/Users/mitchellfrisch/Documents/Whale Tag/gm14_279aprh.csv'
    logname = '/Users/mitchellfrisch/Documents/Whale Tag/gm279alog.txt'
    plot2D(filename, logname)