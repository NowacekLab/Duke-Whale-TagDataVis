# Originally created & tested as a Jupyter Notebook, untested as a regular python script

import plotly.graph_objects as go
import pandas as pd
import csv
import plotly.express as px

df = pd.read_csv('mn17_005aprh25.mat.csv') 

startIndex = 0
endIndex = len(df)

xAxis = list(range(startIndex, endIndex))
for i in range(len(xAxis)):
    xAxis[i] = xAxis[i]*(50/3600)
    
headingData = df.Heading[startIndex:endIndex]
pitchData = df.Pitch[startIndex:endIndex]
rollData = df.Roll[startIndex:endIndex]

headingPitchRoll = go.Figure()
headingPitchRoll.add_trace(go.Scatter(x=xAxis, y=headingData,
                    mode='lines',
                    name='heading'))
headingPitchRoll.add_trace(go.Scatter(x=xAxis, y=pitchData,
                    mode='lines',
                    name='pitch'))
headingPitchRoll.add_trace(go.Scatter(x=xAxis, y=rollData,
                    mode='lines',
                    name='roll'))
                    
headingPitchRoll.write_html('headingpitchroll.html', auto_open=True)
