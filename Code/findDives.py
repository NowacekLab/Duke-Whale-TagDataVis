"""
Find dives
"""

import numpy as np
import pandas as pd
import scipy as sp

import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

def plotDives(filename, min_length = 60, required_depth = None, max_depth = None, interest_variables = [], shading = 'deep'):
    """
    This function pulls individual dives from the data that meet defined criteria.
    It then plots these dives next to each other starting from a shared zeroed start time.
    The dives can be colorscaled based on "interest variables"

    Inputs:
    filename : .csv file of data (must include 'Depth', a sampling frequency 'fs', and any interest variables)
    min_length : type int or float, sets the minimum length of a dive in seconds before a dive is recorded (Default is 60 seconds)
    required_depth : type int or float, a dive must reach this depth (same units as file) in order to be recorded (Defualt is None)
    max_depth : type int or float, dives over that reach a depth greater than this will not be recorded (Default is None)
    interest_variables : tpye list of string, each string is the name of a variable to coloscale dives, creates a subplot for each
    shading : type string, choose any PlotLy colorscale to set the color (Default is 'deep')

    Tips:
    For cyclical data like Pitch, Roll, or Heading try setting 'shading' to 'icefire' one of PlotLy's cyclical colorscales
    Though not technically cyclical, 'balance' provides a similar effect
    """
    # Pull in Data
    data = pd.read_csv(filename) 

    # Pull Specific Variables : 
    fs = data['fs'].tolist()[0]
    depth = np.array(data["Depth"])

    # Calculate time in terms of hours
    numData = len(depth)
    t = np.array([x/fs/3600 for x in range(numData)])

    # Deifne the surface
    sigma = np.std(depth[0:fs*2])
    surface = (depth*[depth < 6*sigma])[0]

    # Section the data into all dives
    diveIndexes = np.where(surface == 0)[0]
    lstDives = np.split(diveIndexes, np.where(np.diff(diveIndexes)!=1)[0]+1)

    # Create a dictionary to record dives
    dives = {}

    # Loop through dives and check that they meet requirements
    for d in lstDives:
        # Set a variable to the depth data
        diveDepth = depth[d]
        # Check Requirements
        if len(d) >= fs*min_length and (True if required_depth == None else np.max(diveDepth) >= required_depth) and (True if max_depth == None else np.max(diveDepth) <= max_depth):
            num = len(dives) + 1
            # Create a dictionary for specific dive
            dive = {}
            dive["name"] = "Dive " + str(num) # Name is used for title of trace, sequential order
            dive["depth"] = diveDepth # Dive path 
            dive["time"] = t[:len(d)] # Time of dive starting at 0
            dive["idx"] = d # Indexes of the dive in full data set
            # Record dive to dives dictionay
            dives[num-1] = dive
            
    # Create Figure
    # Check to see if interest variables declared 
    if not interest_variables:
        fig = go.Figure()
    # If interest variables declared, make subplots for each
    else:
        fig = go.Figure(
            make_subplots(
                rows = (len(interest_variables)),
                cols = 1,
                specs = [[{}]]*(len(interest_variables)),
                subplot_titles = ["Colorscale based on " + name for name in interest_variables],
                shared_xaxes = True
            )
        )

    # Plot Dives
    if not interest_variables:
        # Loop through dives and plot a trace for each
        for i in range(len(dives)):
            d = dives[i]
            fig.add_trace(go.Scattergl(x = d["time"], y = d["depth"], name = d["name"], mode = "markers"))
        
        # Update x-axis, with range slider
        fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True))
    # If interest variables declared plot traces with colorscale
    else:
        numVars = len(interest_variables) # Ease of access varible for number of interest variables

        # Determine loactions for color bars
        clocSpacing = 1/numVars/2 # spacing variable for color bar placement
        cbarlocs = [1 - (clocSpacing * (1 + 2*i)) for i in range(numVars)] # List of y-axis locations for colorbars

        # Loop through Interest Variables
        for k in range(len(interest_variables)):
            # Set current variable and associated data
            var = interest_variables[k]
            varData = np.array(data[var])

            # Loop through Dives
            for i in range(len(dives)):
                d = dives[i]
                # Add trace
                fig.add_trace(go.Scattergl(x = d["time"], 
                                           y = d["depth"],
                                           name = d["name"],
                                           # Group legends of each dive across subplots
                                           legendgroup = str(i),
                                           showlegend = (True if k == 0 else False),
                                           mode = "markers",
                                           # Set colorscale
                                           marker = dict(color = varData[d["idx"]],
                                                         cmax = np.max(varData),
                                                         cmin = np.min(varData),
                                                         colorbar = dict(title = var, len = clocSpacing*2, x = -0.15, y = cbarlocs[k]),
                                                         colorscale = shading),
                                           ), 
                                           row = k+1,
                                           col = 1,
                                           )

        # Update x-axis
        fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), col = 1, row = numVars)

    
    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed")
    
    # Update Title of plot
    fig.update_layout(
        title = "Dives from " + filename.split('/')[-1],
    )

    # Showm Figure or Error if no Dives found
    if len(dives) == 0:
        print("No Dives Found, try new requirements")
    else:
        fig.show()

if __name__ == '__main__':
    csvFile = '/Users/mitchellfrisch/Documents/Whale Tag/Data/gm/gm12_172/gm12_172aprh_calculations.csv'
    
    plotDives(csvFile, 120,required_depth=200, max_depth=300, interest_variables=["Pitch", "Roll"], shading='balance')

