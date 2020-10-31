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
    fig.add_trace(go.Scattergl(x = t_hr, y = p, mode = "lines", name = "Depth"), row = 1, col = 1) 
    fig.add_trace(go.Scattergl(x = t_hr, y = head, mode = "lines", name = "Head"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = pitch, mode = "lines", name = "Pitch"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = roll, mode = "lines", name = "Roll" ), row = 2, col = 1)

    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = 2, col = 1)
    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)



    # # Create Checkboxes for which data to plot
    # use_head = widgets.Checkbox(
    #     description='Head: ',
    #     value=True,
    # )
    # use_pitch = widgets.Checkbox(
    #     description='Pitch: ',
    #     value=True,
    # )
    # use_roll = widgets.Checkbox(
    #     description='Roll: ',
    #     value=True,
    # )

    # container = widgets.HBox(children=[use_head, use_pitch, use_roll])

    # # Create response function to update traces when boxes are checked
    # def response(change):
    #    fig.update_traces(visible = [True, use_head.value, use_pitch.value, use_roll.value]) 

    # # Watch Checkboxes for changes
    # use_head.observe(response, names="value")
    # use_pitch.observe(response, names="value")
    # use_roll.observe(response, names="value")

    # # Show the Figure
    # # fig.show()
    # widgets.VBox([container,
    #               fig])
    fig.show()

    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_demoPlot2D.html')

if __name__ == '__main__':
    plot2D('../Pm19_136aprh.csv')