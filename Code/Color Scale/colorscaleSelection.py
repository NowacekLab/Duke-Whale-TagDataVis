'''
Color Scale Plot
Plots pitch, roll, and heading as color scales on depth
'''

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import scipy.signal as sg
# pip install ipywidgets
from plotly.subplots import make_subplots

def plotColorScale(filename):
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

    '''
    Figure with one plot and buttons to switch color grade
    '''

    # Make Button List
    # Add button
    buttonList = []

    buttonList.append(dict(label = "Pitch",
                        method = 'update',
                        args = [{'visible': [True, False, False]},
                                {'title': 'Depth vs. Time: Choose Colorscale',
                                'showlegend':False}]
                    ))
    buttonList.append(dict(label = "Heading",
                        method = 'update',
                        args = [{'visible': [False, True, False]},
                                {'title': 'Depth vs. Time: Choose Colorscale',
                                'showlegend':False}]
                    ))
    buttonList.append(dict(label = "Roll",
                        method = 'update',
                        args = [{'visible': [False, False, True]},
                                {'title': 'Depth vs. Time: Choose Colorscale',
                                'showlegend':False}]
                    ))
    
    # Make Figure
    fig = go.Figure()

    # Updata Figure
    fig.update_layout(
            title="Depth vs. Time: Choose Colorscale",
            # Add in buttons to select which point of interest to display
            updatemenus=[dict(
                type="buttons",
                buttons = buttonList
            )]
    )
    fig.update_xaxes(title_text = "Time (hr)")
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed")

    # Add Traces with Colorscale
    fig.add_trace(go.Scattergl(x = sT_hr, y = sP, marker=dict(
        size=10,
        cmax=90,
        cmin=-90,
        color= sPitch,
        colorbar=dict(
            title="Pitch (deg)"
        ),
        colorscale="IceFire"
    ),mode = "markers", visible = True)) 
    fig.add_trace(go.Scattergl(x = sT_hr, y = sP, marker=dict(
        size=10,
        cmax=180,
        cmin=-180,
        color= sHead,
        colorbar=dict(
            title="Heading (deg)"
        ),
        colorscale="IceFire"
    ),mode = "markers", visible = False)) 
    fig.add_trace(go.Scattergl(x = sT_hr, y = sP, marker=dict(
        size=10,
        cmax=180,
        cmin=-180,
        color= sRoll,
        colorbar=dict(
            title="Roll (deg)"
        ),
        colorscale="IceFire"
    ),mode = "markers", visible = False))

    # Show figure and save as an HTML
    fig.show()
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_colorscaleSelection.html')

if __name__ == '__main__':
    plotColorScale('Pm19_136aprh.csv')