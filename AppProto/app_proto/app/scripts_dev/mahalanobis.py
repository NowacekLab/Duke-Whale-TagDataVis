'''
Author: Mitchell
This code is used to find the mahalanobis distance between three variables and highlight points of interest
- Edited by Joon Young for app purposes 
'''

import pandas as pd
import numpy as np
import scipy as sp
import scipy.signal as sg
from scipy.stats import chi2
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import math
from helpers import cmdArgs
import os 
import sys 

def mahalanobis(x=None, data=None, cov=None):
    """Compute the Mahalanobis Distance between each row of x and the data  
    x    : vector or matrix of data with, say, p columns.
    data : ndarray of the distribution from which Mahalanobis distance of each observation of x is to be computed.
    cov  : covariance matrix (p x p) of the distribution. If None, will be computed from data.
    """
    # print("Started Mahalanobis Function")
    x_minus_mu = x - np.mean(data)
    if not cov:
        cov = np.cov(data.values.T)
    inv_covmat = sp.linalg.inv(cov)
    left_term = np.dot(x_minus_mu, inv_covmat)
    mahal = np.dot(left_term, x_minus_mu.T)
    # print("Ended mahalanobis Function")
    return mahal.diagonal()

def exportFig(fig, new_file_path):
    fig.write_html(new_file_path)

def findPOI(calc_file_path, new_file_path, is_export, var1, var2, var3, 
            p_limit = 0.003, windowSize = 60, groupSize = 5, depthLimit = 0):
    """
    This function utilizes mahalanobis distance to find points of interest. 
    A group of points of 'groupSize' number of windows is slid across the data at 1 window intervals. 
    Each window consists of 'windowSize' times the sampling frequency number of points. 
    The mean mahalanobis distance of overlaping windows was then recorded.
    Variables:
        calc_file_path : .csv file of data (must include var1, var2, var3, and a sampling frequency 'fs')
        target_dir : target directory to save to if is_export
        is_export : True or False for exporting or simpy viewing 
        var1, var2, var3 : strings of the names of the variables to calcualate mahalanobis distance between
        p_limit : p value of mahalanobis distance must be less than this value to trigger POI
        windowSize : length in seconds of a window of data, default 60 seconds to calculate mahalanobis distance
        groupSize : number of instersecting windows to calucualte mean from, default 5 windows
        depthLimit : minimum depth necessary in order for POI to trigger, default 0
    """
    # Pull in Data
    data = pd.read_csv(calc_file_path)

    # Pull Specific Variables : 
    fs = data['fs'].tolist()[0]
    p = np.array(data["Depth"])

    # True time in datetime format
    """commented out due to errors with marker plot and datetime"""
    # t = data["Time"]

    # Calculate time 
    numData = len(p)
    t = [x/fs for x in range(numData)]
    t_hr = [x/3600 for x in t]

    # Pull variables of interest into one dataframe
    df_x = data[[var1, var2, var3]]

    # Compute index length of window
    window = int(fs*windowSize) # Converted to int because some of fs are floats 
    numWindows = math.floor(len(p)/window) # Number of windows in dataset

    # Create groups to run through
    group = window*groupSize # GroupSize defined by function inputs
    numGroups = math.floor(len(p)/group)
    
    # Alternate Windowing method:
    # Create Dataframe for calculating mean mahalanobis between intersections
    mean_df = pd.DataFrame(np.NaN, index = range(group + window*(groupSize-1)), columns = range(groupSize))
    # Create an array to compile averaged mahalanobis distances per window
    l_mahala = [0]*len(p)

    # Loop through windows of the data
    for i in range(numWindows):
        # Print Status of function in console
        # print(i+1,"of", numWindows)
        # First windows within the groupSize
        if i < groupSize:
            # Fill the mean dataframe
            mean_df[i][window*i : window*i + group] = mahalanobis(x = df_x[(window*i): (window*i+group)], data = data[[var1, var2, var3]][(window*i):(window*i + group)])
            l_mahala[window*i:window*(i+1)] = mean_df.mean(axis = 1)[window*i:window*(i+1)]
        # Middle Windows with full overlap for mean calculation
        elif i >= groupSize and i <= (numWindows - groupSize):
            # Shift mean dataframe to track the next window
            mean_df.shift(periods = -window, axis = 0)
            mean_df.shift(periods = -1, axis = 1)
            # Fill mean dataframe and calculate overlapping means
            mean_df[(groupSize-1)][window*(groupSize-1):] = mahalanobis(x = df_x[(window*i): (window*i+group)], data = data[[var1, var2, var3]][(window*i):(window*i + group)])
            l_mahala[window*i:window*(i+1)] = mean_df.mean(axis = 1)[window*(groupSize-1):window*groupSize]
        # End of the data, must account for not full window at the end
        else:
            # Shift mean dataframe to track the next window
            mean_df.shift(periods = -window, axis = 0)
            mean_df.shift(periods = -1, axis = 1)
            # Fill mean dataframe and calculate overlapping means
            mean_df[(groupSize-1)][window*(groupSize-1): (window*(groupSize-1) + len(data[var1][(window*i):]))] = mahalanobis(x = df_x[(window*i):], data = data[[var1, var2, var3]][(window*i):])
            # Fill averaged mahalanobis, if tree for final window which most likely is not full
            if i == numWindows - 1:
                l_mahala[window*i:] = mean_df.mean(axis = 1)[window*(groupSize-1):(window*(groupSize-1) + len(data[var1][(window*i):]))]
            else:
                l_mahala[window*i:window*(i+1)] = mean_df.mean(axis = 1)[window*(groupSize-1):window*groupSize]

    # Insert mean mahalanobis distance list into dataframe
    df_x['mahala'] = l_mahala

    # Compute P-Values of mahalanobis distance
    df_x['p_value'] = 1 - chi2.cdf(df_x['mahala'], 2)

    # Pull indexes of points with p values smaller than the set limit
    POIpts = df_x.loc[df_x.p_value < p_limit]

    # Pull and x and y for depth of POI
    POIx = [t_hr[i] for i in POIpts.index if p[i] > depthLimit]
    POIy = [p[i] for i in POIpts.index if p[i] > depthLimit]

    # Make Figure 
    fig = go.Figure(
            make_subplots(
                # Deifne dimensions of subplot
                rows = 2, cols=1, 
                # Define what plot goes where and the type of plot
                specs = [[{}],
                        [{}]],
                shared_xaxes = True
            )
        )

    # Create traces for the data and add to figure
    # fig.add_trace(go.Scattergl(x = sT_hr, y = sP, mode = "lines", name = "Depth"), row = 1, col = 1) 
    fig.add_trace(go.Scattergl(x = t_hr, y = p, mode = "lines", name = "Depth"), row = 1, col = 1) 
    fig.add_trace(go.Scattergl(x = POIx, y = POIy, mode = "markers", name = "POI", marker = dict(color = 'green', symbol = 'square', size = 10)), row = 1, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x[var1], mode = "lines", name = var1), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x[var2], mode = "lines", name = var2), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x[var3], mode = "lines", name = var3), row = 2, col = 1)

    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = 2, col = 1)
    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)

    # Code to add windowing button - 
    """commented out until x axis is in datetime format"""
    # fig.update_layout(
    #     title = filename.split('/')[-1],
    #     width = 1200,
    #     height = 800,
    #     xaxis=dict(
    #         rangeselector=dict(
    #             buttons=list([
    #                 dict(count=1,
    #                     label="1 hr",
    #                     step="hour",
    #                     stepmode="backward"),
    #                 dict(count=30,
    #                     label="30 min",
    #                     step="minute",
    #                     stepmode="backward"),
    #                 dict(count=10,
    #                     label="10 min",
    #                     step="minute",
    #                     stepmode="backward"),
    #                 dict(count=1,
    #                     label="1 min",
    #                     step="minute",
    #                     stepmode="backward"),
    #                 dict(count=30,
    #                     label="30 sec",
    #                     step="second",
    #                     stepmode="backward"),
    #                 dict(step="all")
    #             ])
    #         ),
    #         type="date"
    #     )
    # )
    
    # Show figure and save as an HTML
    
    if is_export:
      exportFig(fig, new_file_path)
    else:
      fig.show()
    
def main(cmdLineArgs: dict):
    try: 
        calc_file_path = cmdLineArgs['calcFilePath']
        new_file_path = cmdLineArgs['newFilePath']
        is_export = cmdLineArgs['isExport']
        var1 = cmdLineArgs['variableOne']
        var2 = cmdLineArgs['variableTwo']
        var3 = cmdLineArgs['variableThree']
        p_limit = cmdLineArgs['pLimit']
        p_limit = float(p_limit)
        window_size = cmdLineArgs['windowSize']
        window_size = float(window_size)
        group_size = cmdLineArgs['groupSize']
        group_size = int(group_size)
        depth_limit = cmdLineArgs['depthLimit']
        depth_limit = float(depth_limit)
            
        is_export = True if is_export == "True" else False  
        
        findPOI(calc_file_path, new_file_path, is_export, var1, var2, var3,
                p_limit, window_size, group_size, depth_limit)
        
        return "SUCCESS"  
    except Exception as e:
        return e 
  
if __name__ == "__main__":
    print(main())
    sys.stdout.flush()  