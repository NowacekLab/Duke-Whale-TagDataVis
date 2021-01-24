'''
Author: Mitchell
This code is used to find points of interest such as feeding points
'''

import pandas as pd
import numpy as np
import scipy as sp
import scipy.signal as sg
from scipy.stats import chi2
import plotly.graph_objects as go
import math
# pip install ipywidgets
from plotly.subplots import make_subplots

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


def findPOI(filename):
    # Pull in Data
    data = pd.read_csv(filename)

    # Pull Specific Variables
    fs = data['fs'].tolist()[0]
    head = data['Heading'].tolist()
    head = [x*180/np.pi for x in head]
    p = data['Depth'].tolist()
    roll = data['Roll'].tolist()
    roll = [x*180/np.pi for x in roll]
    pitch = data['Pitch'].tolist()
    pitch = [x*180/np.pi for x in pitch]
    Aw_x = data['WhaleAccel_X'].tolist()
    # print("Lenght of Aw_x: ", len(Aw_x))

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

    # Find Mahalanobis Distance

    df_x = data[['WhaleAccel_X', 'WhaleAccel_Y', 'WhaleAccel_Z']]
    # print("Lenght of df_x(whaleaccel): ", len(df_x['WhaleAccel_X']))
    # print(data[['WhaleAccel_X', 'WhaleAccel_Y', 'WhaleAccel_Z']][0:10])
    # print(df_x['WhaleAccel_X'].head(10))
    l_mahala = []
    window = int(fs*60) # Converted to int because some of fs are floats 
    
    for i in range(math.floor(len(p)/window)):
        l_mahala[(window*(i+1)-1):(window*(i+1)-1)] = mahalanobis(x=df_x[(window*i):(window*(i+1))], data=data[['WhaleAccel_X', 'WhaleAccel_Y', 'WhaleAccel_Z']][(window*i):(window*(i+1))])
        if i == math.floor(len(p)/window)-1:
            l_mahala[(window*(i+1)-1):(window*(i+1)-1)] = mahalanobis(x=df_x[(window*(i+1)):len(p)], data=data[['WhaleAccel_X', 'WhaleAccel_Y', 'WhaleAccel_Z']][(window*(i+1)):len(p)])
    df_x['mahala'] = l_mahala
    # print("Lenght of data(mahala): ", len(df_x['mahala']))
    df_x.head()

    # Compute the P-Values
    df_x['p_value'] = 1 - chi2.cdf(df_x['mahala'], 2)

    # Extreme values with a significance level of 0.001
    # print(df_x['mahala'].head(10))
    # print(df_x.loc[df_x.p_value < 0.01].head(10))
    POIpts = df_x.loc[df_x.p_value < 0.001]
    # print(POIpts.index)

    

    # Implement Rolling Standard Deviation

    # r_STD = pd.rolling_std(sPitch, fs)
    pdPitch = pd.Series(pitch)
    r_STD = pdPitch.rolling(int(window/scale)).std()

    # Highlight POI
    # POIx = [sT_hr[i] for i in range(len(r_STD)) if r_STD[i] < 5 and sP[i] > 50]
    # POIy = [sPitch[i] for i in range(len(r_STD)) if r_STD[i] < 5 and sP[i] > 50]

    depthLimit = 15
    stdLimit = 7.5
    POIx = [t_hr[i] for i in POIpts.index if p[i] > depthLimit and r_STD[i] < stdLimit]
    POIy = [p[i] for i in POIpts.index if p[i] > depthLimit and r_STD[i] < stdLimit]

    # Make Widget Figure 
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
    fig.add_trace(go.Scattergl(x = sT_hr, y = sP, mode = "lines", name = "Depth"), row = 1, col = 1) 
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x["WhaleAccel_X"], mode = "lines", name = "Aw X"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x["WhaleAccel_X"], mode = "lines", name = "Aw Y"), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x["WhaleAccel_X"], mode = "lines", name = "Aw Z" ), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = df_x["mahala"], mode = "lines", name = "Mahalanobis" ), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = t_hr, y = pitch, mode = "lines", name = "Pitch" ), row = 2, col = 1)
    fig.add_trace(go.Scattergl(x = POIx, y = POIy, mode = "markers", name = "POI", marker = dict(color = 'green', symbol = 'square', size = 10)), row = 1, col = 1)

    # Update x-axis
    fig.update_xaxes(title = "Time (hr)", rangeslider = dict(visible = True), row = 2, col = 1)
    # Update y-axis
    fig.update_yaxes(title = "Depth (m)", autorange = "reversed", row = 1, col = 1)

    fig.update_layout(title = filename)
    # Show figure and save as an HTML
    fig.show()
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '_findPOI_v1.html')

    # # X = fft(pitch)/L*2; X(1) = X(1)/2;
    # # f = [0:L-1]'/L*fs;
    # Lseg = fs*120
    # Nseg = int(len(p)/Lseg)
    # remainder = len(p)%Lseg
    # f = [x*fs/Lseg for x in range(Lseg-1)]
    # segF = []
    # segFinds = []

    # for i in range(Nseg):
    #     X = np.fft.fft(pitch[i*Lseg:i*(Lseg-1)])/Lseg*2
    #     ind = X.index(max(X))
    #     segF.append(f[ind])
    #     segFinds.append(Lseg*i)

if __name__ == '__main__':
    findPOI('gm12_172aprh.csv')
        