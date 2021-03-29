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

def radiansToDegrees(degrees):
    for i in range(len(degrees)):
        degrees[i] = degrees[i]*(180/math.pi)

radiansToDegrees(df["Heading"])

changes = {
    "time" : [],
    "change" : [],
}

def calculateROC(df, poi, field):
    for i in range(len(df)-1):
        roc = (df[field][i+1]-df[field][i])/(xAxis[i+1]-xAxis[i])
        changes["time"].append(xAxis[i])
        changes["change"].append(roc)

calculateROC(df, changes, "Heading")

poi = {
    "time" : [],
    "poi" : [],
}

def identifyPOI(poi, df, field, interval, threshold):
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
                        poi["poi"].append(df["field"][j])

identifyPOI(poi, df, "Heading", 5, 10000)

def makeGraphs(field):
    findPOI = make_subplots(rows = 2, cols = 1, subplot_titles=(field + "Over Time", "Average Rate of Change"))
    findPOI.add_trace(go.Scatter(x=xAxis, y=df[field], mode = 'markers', name = field), row=1, col=1)
    findPOI.add_trace(go.Scatter(x=poi["time"], y=poi["poi"], mode = 'markers', name = 'points of interest'), row=1, col=1)
    findPOI.add_trace(go.Scatter(x=changes["time"], y=changes["change"], mode = 'lines', name = 'rate of change'), row=2, col=1)

    findPOI.update_layout(
        xaxis=dict(
            rangeslider=dict(
                visible=True
            )
        )
    )
    findPOI.write_html(field + 'POI.html', auto_open = True)
    
    
makeGraphs("Heading")
