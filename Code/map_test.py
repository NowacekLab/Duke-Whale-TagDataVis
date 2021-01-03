# -*- coding: utf-8 -*-
"""
Created on Mon Dec 21 14:16:13 2020

@author: Vincent
"""

import plotly.graph_objects as go
import pandas as pd
from plotly.offline import plot
import re
import numpy as np
tagdata = pd.read_csv('../Data/gm14_279aprh_calculations.csv')
gps = pd.read_csv('../Data/20141006_Barber_Focal_Follow_Gm_14_279a_calculations.csv')
startlat = float(re.findall("[+-]?\d+\.\d+", gps['Location (Latitude)'][0])[0])
startlong = float(re.findall("[+-]?\d+\.\d+", gps['Location (Longitude)'][0])[0])
latdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in gps['Location (Latitude)']]
longdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in gps['Location (Longitude)']]
datalat = (tagdata['Y Position'].to_numpy()) / 111111 + startlat
datalong = startlong - (tagdata['X Position'].to_numpy()) / 111111 * np.cos(datalat / 180 * np.pi) 

fig = go.Figure()

fig.add_trace(go.Scattergeo(
    locationmode = 'USA-states',
    lon = datalong,
    lat = datalat,
    mode = 'markers',
    marker = dict(
        size = 2,
        color = 'rgb(255, 0, 0)',
        line = dict(
            width = 3,
            color = 'rgba(68, 68, 68, 0)'
        )
    )))

fig.add_trace(
    go.Scattergeo(
        locationmode = 'USA-states',
        lon = longdata,
        lat = latdata,
        mode = 'lines',
        line = dict(width = 1,color = 'red'),
    )
)
fig.update_layout(
    title_text = 'Feb. 2011 American Airline flight paths<br>(Hover for airport names)',
    showlegend = False,
    geo = dict(
        scope = 'north america',
        projection_type = 'azimuthal equal area',
        showland = True,
        landcolor = 'rgb(243, 243, 243)',
        countrycolor = 'rgb(204, 204, 204)',
    ),
)

plot(fig)