from plotly.subplots import make_subplots
import plotly.graph_objects as go
import pandas as pd
import csv
import math

df = pd.read_csv('mn17_005aprh25.mat.csv') 

startIndex = 0
endIndex = len(df)

xAxis = list(range(startIndex, endIndex))
for i in range(len(xAxis)):
    xAxis[i] = xAxis[i]*(50/3600)

def radiansToDegrees(heading):
    for i in range(len(heading)):
        heading[i] = heading[i]*(180/math.pi)

radiansToDegrees(df["Heading"])

poi = {
    "time" : [],
    "heading" : [],
}

def checkForPOI(df, poi):
    for i in range(len(df)-1):
        if (df["Heading"][i] > 160 and df["Heading"][i+1] < -160) or (df["Heading"][i] < -160 and df["Heading"][i+1] > 160):
            poi["time"].append(xAxis[i])
            poi["time"].append(xAxis[i+1])
            poi["heading"].append(df["Heading"][i])
            poi["heading"].append(df["Heading"][i+1])

checkForPOI(df, poi)

headingPOI = go.Figure()

headingPOI.add_trace(go.Scatter(x=xAxis, y=df["Heading"], mode = 'markers', name = 'heading'))

headingPOI.add_trace(go.Scatter(x=poi["time"], y=poi['heading'], mode = 'markers', name = 'points of interest'))

headingPOI.write_html('headingPOI.html', auto_open=True)