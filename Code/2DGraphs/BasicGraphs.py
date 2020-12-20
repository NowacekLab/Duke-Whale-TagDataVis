# Originally created & tested in Jupyter Notebooks, untested as a regular python script
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import pandas as pd
import csv

df = pd.read_csv('mn17_005aprh25.mat.csv') 

startIndex = 0
endIndex = len(df)

xAxis = list(range(startIndex, endIndex))
for i in range(len(xAxis)):
    xAxis[i] = xAxis[i]*(50/3600)
    
headData = df.Heading[startIndex:endIndex]

timeplots = make_subplots(rows=3, cols=2, 
                      subplot_titles=("Heading", "Pitch", 
                                      "X Acceleration", "Roll", "Y Acceleration", "Z Acceleration"))
timeplots.add_trace(
    go.Scatter(x=xAxis, y=headData, name = "heading"),
    row=1, col=1
)

pitchData = df.Pitch[startIndex:endIndex]
rollData = df.Roll[startIndex:endIndex]

timeplots.add_trace(
    go.Scatter(x=xAxis, y=pitchData, name = "pitch"),
    row=1, col=2
)

xAccelerationData = df["Accel_X"][startIndex:endIndex]

timeplots.add_trace(
    go.Scatter(x=xAxis, y=xAccelerationData, name = "x-acceleration"),
    row=2, col=1
)

timeplots.add_trace(
    go.Scatter(x=xAxis, y=rollData, name = "roll"),
    row=2, col=2
)

yAccelerationData = df["Accel_Y"][startIndex:endIndex]

timeplots.add_trace(
    go.Scatter(x=xAxis, y=yAccelerationData, name = "y-acceleration"),
    row=3, col=1
)

zAccelerationData = df["Accel_Z"][startIndex:endIndex]

timeplots.add_trace(
    go.Scatter(x=xAxis, y=zAccelerationData, name = "z-acceleration"),
    row=3, col=2
)

timeplots.update_layout(height = 1500, width=1500, title_text="2D Plots")
timeplots.write_html('2Dplots.html', auto_open=True)
