import plotly
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

changes = {
    "time" : [],
    "change" : [],
}

def calculateROC(df, poi):
    for i in range(len(df)-1):
        roc = (df["Heading"][i+1]-df["Heading"][i])/(xAxis[i+1]-xAxis[i])
        changes["time"].append(xAxis[i])
        changes["change"].append(roc)

calculateROC(df, changes)

poi = {
    "time" : [],
    "poi" : [],
}

def identifyPOI(poi, df, interval, threshold):
    for i in range(len(changes["time"])+interval):
        if(i%interval==0):
            avgROC = 0
            for j in range(i, i+interval):
                if(j<len(changes["time"])):
                    avgROC += abs(changes["change"][j])
            avgROC /= interval
            if avgROC > threshold:
                for j in range(i, i+interval):
                    if(j<len(changes["time"])):
                        poi["time"].append(changes["time"][j])
                        poi["poi"].append(df["Heading"][j])

identifyPOI(poi, df, 5, 10000)

headingPOI = make_subplots(rows = 2, cols = 1, subplot_titles=("Heading Over Time", "Average Heading Rate of Change"))
headingPOI.add_trace(go.Scatter(x=xAxis, y=df["Heading"], mode = 'markers', name = 'heading'), row=1, col=1)
headingPOI.add_trace(go.Scatter(x=poi["time"], y=poi["poi"], mode = 'markers', name = 'points of interest'), row=1, col=1)
headingPOI.add_trace(go.Scatter(x=changes["time"], y=changes["change"], mode = 'lines', name = 'rate of change'), row=2, col=1)

headingPOI.update_layout(
    xaxis=dict(
        rangeslider=dict(
            visible=True
        )
    )
)
headingPOI.write_html('HeadingPOI.html', auto_open = True)