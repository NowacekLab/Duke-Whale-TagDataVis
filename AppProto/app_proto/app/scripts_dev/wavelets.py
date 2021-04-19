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

def upArrow_op(li, j):
    if j == 0:
        return [1]
    N = len(li)
    li_n = np.zeros(2 ** (j - 1) * (N - 1) + 1)
    for i in range(N):
        li_n[2 ** (j - 1) * i] = li[i]
    return li_n


def period_list(li, N):
    n = len(li)
    # append [0 0 ...]
    n_app = N - np.mod(n, N)
    li = list(li)
    li = li + [0] * n_app
    if len(li) < 2 * N:
        return np.array(li)
    else:
        li = np.array(li)
        li = np.reshape(li, [-1, N])
        li = np.sum(li, axis=0)
        return li


def circular_convolve_mra(h_j_o, w_j):
    ''' calculate the mra D_j'''
    N = len(w_j)
    l = np.arange(N)
    D_j = np.zeros(N)
    for t in range(N):
        index = np.mod(t + l, N)
        w_j_p = np.array([w_j[ind] for ind in index])
        D_j[t] = (np.array(h_j_o) * w_j_p).sum()
    return D_j


def circular_convolve_d(h_t, v_j_1, j):
    '''
    jth level decomposition
    h_t: \tilde{h} = h / sqrt(2)
    v_j_1: v_{j-1}, the (j-1)th scale coefficients
    return: w_j (or v_j)
    '''
    N = len(v_j_1)
    L = len(h_t)
    w_j = np.zeros(N)
    l = np.arange(L)
    for t in range(N):
        index = np.mod(t - 2 ** (j - 1) * l, N)
        v_p = np.array([v_j_1[ind] for ind in index])
        w_j[t] = (np.array(h_t) * v_p).sum()
    return w_j


def circular_convolve_s(h_t, g_t, w_j, v_j, j):
    '''
    (j-1)th level synthesis from w_j, w_j
    see function circular_convolve_d
    '''
    N = len(v_j)
    L = len(h_t)
    v_j_1 = np.zeros(N)
    l = np.arange(L)
    for t in range(N):
        index = np.mod(t + 2 ** (j - 1) * l, N)
        w_p = np.array([w_j[ind] for ind in index])
        v_p = np.array([v_j[ind] for ind in index])
        v_j_1[t] = (np.array(h_t) * w_p).sum()
        v_j_1[t] = v_j_1[t] + (np.array(g_t) * v_p).sum()
    return v_j_1


def modwt(x, filters, level):
    '''
    filters: 'db1', 'db2', 'haar', ...
    return: see matlab
    '''
    # filter
    wavelet = pywt.Wavelet(filters)
    h = wavelet.dec_hi
    g = wavelet.dec_lo
    h_t = np.array(h) / np.sqrt(2)
    g_t = np.array(g) / np.sqrt(2)
    wavecoeff = []
    v_j_1 = x
    for j in range(level):
        w = circular_convolve_d(h_t, v_j_1, j + 1)
        v_j_1 = circular_convolve_d(g_t, v_j_1, j + 1)
        wavecoeff.append(w)
    wavecoeff.append(v_j_1)
    return np.vstack(wavecoeff)


def imodwt(w, filters):
    ''' inverse modwt '''
    # filter
    wavelet = pywt.Wavelet(filters)
    h = wavelet.dec_hi
    g = wavelet.dec_lo
    h_t = np.array(h) / np.sqrt(2)
    g_t = np.array(g) / np.sqrt(2)
    level = len(w) - 1
    v_j = w[-1]
    for jp in range(level):
        j = level - jp - 1
        v_j = circular_convolve_s(h_t, g_t, w[j], v_j, j + 1)
    return v_j


def modwtmra(w, filters):
    ''' Multiresolution analysis based on MODWT'''
    # filter
    wavelet = pywt.Wavelet(filters)
    h = wavelet.dec_hi
    g = wavelet.dec_lo
    # D
    level, N = w.shape
    level = level - 1
    D = []
    g_j_part = [1]
    for j in range(level):
        # g_j_part
        g_j_up = upArrow_op(g, j)
        g_j_part = np.convolve(g_j_part, g_j_up)
        # h_j_o
        h_j_up = upArrow_op(h, j + 1)
        h_j = np.convolve(g_j_part, h_j_up)
        h_j_t = h_j / (2 ** ((j + 1) / 2.))
        if j == 0: h_j_t = h / np.sqrt(2)
        h_j_t_o = period_list(h_j_t, N)
        D.append(circular_convolve_mra(h_j_t_o, w[j]))
    # S
    j = level - 1
    g_j_up = upArrow_op(g, j + 1)
    g_j = np.convolve(g_j_part, g_j_up)
    g_j_t = g_j / (2 ** ((j + 1) / 2.))
    g_j_t_o = period_list(g_j_t, N)
    S = circular_convolve_mra(g_j_t_o, w[-1])
    D.append(S)
    return np.vstack(D)

def plotWavelets(calc_file_path, new_file_path_one, new_file_path_two, is_export_one, is_export_two, var, wavelet = 'haar', levels = 5, level_select = None, depthLimit = 0, prominence = 0.1, colorByVar = False, shading = 'deep', showLevels = False):
    """
    This function performs Maximal Overlap Discrete Wavelet Transfom on the data.
    Based on the chosen criteria and scale the function will determine Points of Interesst and circle them on the plot

    Inputs:
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
    data = pd.read_csv(calc_file_path) 

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
    if is_export_one:
        fig.write_html(new_file_path_one)
    else:
        fig.show()

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
        if is_export_two:
            fig2.write_html(new_file_path_two)
        else:
            fig2.show()
        
def main(cmdLineArgs: dict):
    try: 
        calc_file_path = cmdLineArgs['calcFilePath']
        new_file_path_one = cmdLineArgs['newFilePathOne']
        new_file_path_two = cmdLineArgs['newFilePathTwo']
        is_export_one = cmdLineArgs['isExportOne']
        is_export_two = cmdLineArgs['isExportTwo']
        var = cmdLineArgs['variable']
        depth_limit = cmdLineArgs['depthLimit']
        depth_limit = float(depth_limit)
        color_by_var = cmdLineArgs['colorByVar']
        showLevels = cmdLineArgs['showLevels']
        
        #        Inputs:
        # calcFilePath, newFilePathOne, newFilePathTwo, isExportOne, isExportTwo
        # var : string that is the name of the variable data on which you would like to perform MODWT
        # depthLimit : float of depth that must be reached before POI are recorded (Default set to 0)
        # colorByVar : boolean, determines whether to shade depth plot based on 'var'
        # showLevels : boolean, creates a second plot of all levels of MODWT and their respective points of interest
            
        is_export = True if is_export == "True" else False  
        
        plotWavelets(calc_file_path, new_file_path_one, new_file_path_two, is_export_one, is_export_two, var, depth_limit = depth_limit, colorByVar = color_by_var, showLevels = showLevels)
        
        return "SUCCESS"  
    except Exception as e:
        return e 