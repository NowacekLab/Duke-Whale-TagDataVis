# -*- coding: utf-8 -*-
"""
Created on Sun Nov  8 15:01:07 2020

@author: Vincent
"""
from scipy.io import loadmat
import numpy as np
from pyquaternion import Quaternion
import matplotlib.pyplot as plt
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot
from scipy.signal import decimate as dc
import pandas as pd

def trackplot(filename):
    csv = pd.read_csv(filename)
    data = csv.to_dict(orient = 'list')    
    x = dc(data['X Position'], 10)
    y = dc(data['Y Position'], 10)
    z = dc(data['Z Position'], 10)
    
    fig = go.Figure(data=go.Scatter3d(
            x=x, y=y, z=z,
        marker=dict(
            size=0.5,
            colorscale='Viridis',
        ),
        line=dict(
            color='darkblue',
            width=0.5
        )
    ))
    
    fig.update_layout(
        width=800,
        height=700,
        scene=dict(
            xaxis_title="X Displacement (m)",
            yaxis_title="Y Displacement (m)",
            zaxis_title="Z Displacement (m)",
            camera=dict(
                up=dict(
                    x=0,
                    y=0,
                    z=1
                ),
                eye=dict(
                    x=0,
                    y=1.0707,
                    z=1,
                )
            ),
            aspectratio = dict( x=1, y=1, z=0.7 ),
            aspectmode = 'manual'
        ),
    )
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '.html')

if __name__ == '__main__':
    trackplot('../Data/gm14_279aprh_calculations.csv')