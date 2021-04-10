"""
Wavelets
"""
import numpy as np
import pandas as pd
import scipy as sp
import scipy.signal as sp_sg
import pywt

import plotly.colors as pco
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

from modwt import modwt, modwtmra


def plotWavelets(filename, var, wavelet = 'haar', levels = 5, level_select = None, depthLimit = 0, prominence = 0.1, colorByVar = False, shading = 'deep', showLevels = False):
    """
    This function performs Maximal Overlap Discrete Wavelet Transfom on the data.
    Based on the chosen criteria and scale the function will determine Points of Interesst and circle them on the plot

    Inputs:
    filename : .csv file of data (must include 'Depth', a sampling frequency 'fs', and 'var')
    var : string that is the name of the variable data on which you would like to perform MODWT
    wavelet : string with the name of the wavelet you would like to use in MODWT (default is 'haar' wavelet)
    levels : integer number of scales for the MODWT
    level_select : integer value in range 0 - levels that selects scale from which to model POI (Default set to int(levels/2))
    depthLimit : float of depth that must be reached before POI are recorded (Default set to 0)
    prominence : float of prominence value for
    colorByVar : boolean, determines whether to shade depth plot based on 'var'
    shading : type string, choose any PlotLy colorscale to set the color (Default is 'deep'), only relevant if colorByVar = True
    showLevels : boolean, creates a second plot of all levels of MODWT and their respective points of interest

    Tips:
    For cyclical data like Pitch, Roll, or Heading try setting 'shading' to 'icefire' one of PlotLy's cyclical colorscales
    Though not technically cyclical, 'balance' provides a similar effect
    """

    # Define level_select if not done by the user
    if not level_select:
        level_select = int(levels/2)

    # Pull in Data
    data = pd.read_csv(filename) 

    # Pull Specific Variables : 
    fs = data['fs'].tolist()[0]
    depth = np.array(data["Depth"])
    varData = np.array(data[var])
    # varData = np.abs(np.array(data[var]))

    # True time in datetime format
    """commented out due to errors with marker plot and datetime"""
    t = data["Time"]

    # Calculate time in terms of hours
    # numData = len(varData)
    # t = np.array([x/fs/3600 for x in range(numData)])

    # Compute Maximal Overlap discrete wavelet transform
    coeffsMO = modwt(varData, wavelet, levels)

    # Determine POI for selected level
    POI, dictPOI = sp_sg.find_peaks(np.abs(coeffsMO[level_select]), prominence = prominence)
    POI = np.array(POI).astype(int)
    POI = POI[depth[POI] >= depthLimit]

    # Make Figure 
    fig = go.Figure(
            make_subplots(
                # Deifne dimensions of subplot
                rows = 2, cols=1, 
                # Define what plot goes where and the type of plot
                specs = [[{}]]*2,
                shared_xaxes = True
            )
        )

    # Plot Traces
    # Depth Plot - add colorscale is colorByVar is True
    if colorByVar:
        fig.add_trace(go.Scatter(x = t, y = depth, mode = "markers", marker = dict(color = varData,
                                                            cmax = np.max(varData),
                                                            cmin = np.min(varData),
                                                            colorbar = dict(title = var, x = -0.15),
                                                            colorscale = shading), name = "Depth"), row = 1, col = 1)
    else:
        fig.add_trace(go.Scatter(x = t, y = depth, mode = "markers", name = "Depth"), row = 1, col = 1)

    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)
    fig.update_yaxes(title = var, autorange = "reversed", row = 2, col = 1)

    # Var Plot
    fig.add_trace(go.Scatter(x = t, y = varData, mode = "markers", marker = dict(color = 'blue'), name = var), row = 2, col = 1)

    # Plotting POI
    fig.add_trace(go.Scatter(x = t[POI],
                               y = depth[POI],
                               mode = "markers",
                               marker = dict(color = 'red',
                                             symbol = 'circle-open',
                                             size = 10),
                               name = "POI",
                               legendgroup = "POI",
                               showlegend = True,
                               ),
                               row = 1, col = 1)
    fig.add_trace(go.Scatter(x = t[POI], y = varData[POI],
                               mode = "markers",
                               marker = dict(color = 'red', symbol = 'circle-open', size = 10),
                               name = "POI",
                               legendgroup = "POI",
                               showlegend = False,
                               ),
                               row = 2, col = 1)
    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = 2, col = 1)

    fig.update_layout(
        title = filename.split('/')[-1] + " Wavelets: " + wavelet,
    )

    # Show figure 1 and save as an HTML
    fig.show()
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_wavelets_' + wavelet + 'depthMap.html')

    # Create Levels plot that shows Wavelet transform by scale if showLevels is True
    if showLevels:
        # Pull color Palete
        colors = pco.DEFAULT_PLOTLY_COLORS

        # Create Figure
        fig2 = go.Figure(
            make_subplots(
                # Deifne dimensions of subplot
                rows = (len(coeffsMO)+1), cols=1, 
                # Define what plot goes where and the type of plot
                specs = [[{}]]*(len(coeffsMO)+1),
                subplot_titles = ["Scale 2^" + str(x) for x in range(len(coeffsMO))].insert(0, var),
                shared_xaxes = True
            )
        )
        fig2.add_trace(go.Scatter(x = t, y = varData, mode = "markers", name = var), row = 1, col = 1)
       

        # Loop through scales
        for i in range(len(coeffsMO)):
            fig2.add_trace(go.Scatter(x = t, y = np.abs(coeffsMO[i]), mode = "lines", marker = dict(color = colors[i]), name = 'Wavelet Scale 2^'+str(i)), row = 2+i, col = 1)

            # Find POI for each 
            POI, dictPOI = sp_sg.find_peaks(np.abs(coeffsMO[i]), prominence = prominence)
            POI = np.array(POI).astype(int)
            POI = POI[depth[POI] >= depthLimit]

            # Plot POI's on variable plot and scale plot
            fig2.add_trace(go.Scatter(x = t[POI], y = varData[POI],
                               mode = "markers",
                               marker = dict(color = colors[i], symbol = 'circle-open', size = 10),
                               name = "Scale 2^"+str(i)+" POI",
                               legendgroup = str(i),
                               showlegend = True,
                               ),
                               row = 1, col = 1)
            fig2.add_trace(go.Scatter(x = t[POI], y = np.abs(coeffsMO[i])[POI],
                               mode = "markers",
                               marker = dict(color = 'red', symbol = 'circle-open', size = 10),
                               name = "Scale 2^"+str(i)+" POI",
                               legendgroup = str(i),
                               showlegend = False,
                               ),
                               row = 2+i, col = 1)
            
        # Update x-axis
        fig2.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = (len(coeffsMO)+1), col = 1)
        
        # Change title of plot
        fig2.update_layout(
            title = filename.split('/')[-1] + " Wavelet Levels for " + wavelet,
        )

        # Open Figure in a new screen
        fig2.show()
    

    


if __name__ == '__main__':
    csvFile = '/Users/mitchellfrisch/Documents/Whale Tag/Data/mn/mn17_011/mn17_011aprh25_calculations.csv'
    var = 'Pitch'

    plotWavelets(csvFile, var, 'db16', depthLimit=5, colorByVar = True, showLevels=True)