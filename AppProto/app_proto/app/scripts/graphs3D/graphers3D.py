"""
3D Graphers called in html3D.py 
"""

from scipy.io import loadmat
from scipy.signal import decimate as dc
from plotly.offline import plot
from pyquaternion import Quaternion
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import pandas as pd 

def trackplot(calc_file_path: str):
    csv = pd.read_csv(calc_file_path)
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
            yaxis_title="X Displacement (m)",
            zaxis_title="X Displacement (m)",
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

    return [fig]

CREATORS = [(trackplot, 'trackplot.html'),]

if __name__ == '__main__':
    # trackplot('../Data/Pm19_136aprh.mat')
    pass 
    