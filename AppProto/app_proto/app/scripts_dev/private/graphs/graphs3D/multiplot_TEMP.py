# -*- coding: utf-8 -*-
"""
Created on Fri Jan  1 13:12:51 2021

@author: Vincent
"""

import plotly.graph_objects as go
import pandas as pd
from plotly.offline import plot

def multiplot(*paths: str) -> go.Figure:
    fig = go.Figure()
    for data in paths:
        csv = pd.read_csv(data)
        latData = csv['Latitude']
        longData = csv['Longitude']
        fig.add_trace(go.Scatter(x = longData, y = latData, mode = 'lines'))
        
        layout = go.Layout(yaxis=dict(scaleanchor="x", scaleratio=1))
    fig.update_layout(yaxis=dict(scaleanchor="x", scaleratio=1))
    plot(fig)