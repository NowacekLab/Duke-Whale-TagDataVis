'''
Author: Mitchell
Points of Interest Figure 
Allows the user to select a point to display with a closer view in the subplots
'''

# from scipy.io import loadmat# pip installed scipy
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import scipy.signal as sg
# pip install ipywidgets
from plotly.subplots import make_subplots


def plotPOI(filename):
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

    # Scaling Factor to reduce amount of data
    scale = 10

    # Reduce Data
    sP = sg.decimate(p,scale).copy()
    sRoll = sg.decimate(roll,scale).copy()
    sPitch = sg.decimate(pitch,scale).copy()
    sHead = sg.decimate(head,scale).copy()

    # Calculate Reduced time 
    numData = len(sP)
    sT = [x/(fs/scale) for x in range(numData)]
    sT_hr = [x/3600 for x in sT]

    tView = 10 # seconds
    N = int(fs*tView/2) # Number of points

    # Create a list of Points of Interest 
    xPOI = [1, 1.5, 2.2] #hour
    # Empty list for y coordinates of points of interest to be populated
    yPOI = []


    #Creat zoomed in x and y data sets
    zoomT = [[] for x in range(len(xPOI))]
    zoomP = [[] for x in range(len(xPOI))]
    zoomR = [[] for x in range(len(xPOI))]

    # Create a set of Data for each of the points of interest
    for k in range(len(xPOI)):
        ind = 3600*xPOI[k]*fs # Get starting Index
        # Add y of Points of Interest
        yPOI.append(p[int(ind)])

        # Zoomed Data
        xdata = p
        # Create a range of indexes across tView centered on the point selected
        # Must take into account end conditions
        if ind < int(tView/2)*fs:
            indRange = np.arange(0, int(tView)*fs, 1)
        elif ind > len(xdata) - int(tView/2)*fs - 1:
            indRange = np.arange(len(xdata)-1-(tView)*fs, len(xdata)-1, 1)
        else:
            indRange = np.arange(int(ind - tView/2*fs), int(ind + tView/2*fs), 1)
        # Loop through indRange and add data to respective points of interest
        for i in indRange:
            # Select even indexs to reduce animation time
            if i%2 == 0:
                zoomT[k].append(t_hr[i])
                zoomP[k].append(p[i])
                rollL = [roll[i], roll[i], (roll[i]+90), roll[i]+180, roll[i], roll[i]+180]
                zoomR[k].append(rollL)

    # fig = go.FigureWidget(make_subplots(
    fig = go.Figure(make_subplots(
        rows = 2, cols=2, 
        # Define what plot goes where and the type of plot
        specs = [[{"rowspan":2},{"type":"polar"}],
                [None, {}]]
        )
        )

    # Add traces to Figure
    trace = go.Scattergl(x=sT_hr, y=sP, mode='lines', name = "Depth")
    fig.add_trace(trace, row = 1, col = 1)
    fig.add_trace(go.Scattergl(x = xPOI, y = yPOI, mode = 'markers', 
                            marker = dict(color = 'green', symbol = 'square', size = 10),
                            name = "Points of Interest"), row = 1, col = 1)
    
    # Loop through points of interest and create traces for each for the subplots
    for k in range(len(xPOI)):
        nameK = "Depth of POI " + str(k) 
        # Polar Plot
        fig.add_trace(go.Scatterpolar(r = [1, 0.25, 0.25, 0.25, 0.25, 1], theta = zoomR[k][0], mode = "lines", visible = False), row = 1, col = 2)
        # Zoomed Depth Plot
        fig.add_trace(go.Scattergl(x = zoomT[k], y = zoomP[k], mode = "lines", visible = False, name = nameK), row = 2, col = 2)
        # Third Trace is for animation purposes 
        fig.add_trace(go.Scattergl(x= [], y = [], mode = 'markers', marker = dict(color="red", size = 10), visible = False), row = 2, col = 2)

    '''
    Update the layout of subplots
    Have to go axis by axis 
    '''
    # Upadte x-axis
    fig.update_xaxes(title_text = "Time (hr)", row = 1, col = 1)
    fig.update_xaxes(title_text = "Time (hr)", row = 1, col = 2)

    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 2, col = 2)

    # Create Button list based on POI
    # Add the initial play button for animation
    buttonList = [dict(label="Play",
                            method="animate",
                            args=[None]
                        )]
    # Create a "visible" list for button creation based on number of POI
    visibleList = [False]*(2 + 3*len(xPOI))
    # The first two traces will always be visible 
    visibleList[0] = True
    visibleList[1] = True
    # Add a None button
    buttonList.append(dict(label = 'None',
                            method = 'update',
                            args = [{'visible': visibleList},
                                    {'title': 'No Selected Point',
                                    'showlegend':True}]
                        ))
    # Loop through POI and add buttons
    for k in range(len(xPOI)):
        labelK  = "POI " + str(k)
        titleK = "POI " + str(k) + " Selected"
        # Copy visible list
        visibleListK = visibleList.copy()
        # Create a list of the indexes of the traces associated with xPOI[k]
        inds = [2+(3*k), 3+(3*k), 4+(3*k)]
        # Flip visibilities to True
        for i in inds:
            visibleListK[i] = True 
        # Add button
        buttonList.append(dict(label = labelK,
                            method = 'update',
                            args = [{'visible': visibleListK},
                                    {'title': titleK,
                                    'showlegend':True}]
                        ))

    # Update Entire Fig Layout
    fig.update_layout(
            title="Select Point of Interest",
            # Add in buttons to select which point of interest to display
            updatemenus=[dict(
                type="buttons",
                buttons = buttonList
            )]
    )

    # Add frames for Animation
    '''
    Currently not working
    TypeError: 'numpy.float64' object is not iterable
    '''
    # frames =[go.Frame(data=[go.Scatter(visible=True),
    #                         go.Scatter(visible=True),
    #                         go.Scatterpolar(r = [1, 0.25, 0.25, 0.25, 0.25, 1], theta = zoomR[0][int(k)], mode = "lines"),
    #                         go.Scatter(visible=True),
    #                         go.Scatter(x = list(zoomT[0][int(k)]), y = list(zoomP[0][int(k)])),
    #                         go.Scatterpolar(r = [1, 0.25, 0.25, 0.25, 0.25, 1], theta = zoomR[1][int(k)], mode = "lines"),
    #                         go.Scatter(visible=True),
    #                         go.Scatter(x = list(zoomT[1][int(k)]), y = list(zoomP[1][int(k)])),
    #                         go.Scatterpolar(r = [1, 0.25, 0.25, 0.25, 0.25, 1], theta = zoomR[2][int(k)], mode = "lines"),
    #                         go.Scatter(visible=True),
    #                         go.Scatter(x = list(zoomT[2][int(k)]), y = list(zoomP[2][int(k)])),
    #                         ],
    #                   traces=[0,1,2,3,4,5,6,7,8,9, 10]) for k in range(int(len(zoomP[0])))] 
    # fig.frames = frames

    # Display Figure
    fig.show()
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_plotPOI.html')

if __name__ == '__main__':
    plotPOI('../Pm19_136aprh.csv')