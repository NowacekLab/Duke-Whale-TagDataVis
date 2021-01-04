"""
3D Graphers called in html3D.py 
"""

#Vincent Note:
    #Make the decimate parameter an input rather than hardcoded as 10? (Lines 29-31-ish)

from scipy.io import loadmat
from scipy.signal import decimate as dc
from plotly.offline import plot
from pyquaternion import Quaternion
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import pandas as pd 

from private.logs import logDecorator 
from private.helpers import kwargsHelper

MODULE_NAME = "graphers3D"

genericLog = logDecorator.genericLog(MODULE_NAME)

@genericLog 
def trackplot(calc_file_path: str): #Multiple ways to do this; for now, I'm just using two inputs because it's easier for testing.
    csv = pd.read_csv(calc_file_path)
    data = csv.to_dict(orient = 'list')    
    x = data['X Position'] 
    y = data['Y Position']
    z = data['Z Position']
    
    markX = data['X Position'][::7500]
    markY = data['Y Position'][::7500]
    markZ = data['Z Position'][::7500]
    markR = data['Roll'][::7500]
    markP = data['Pitch'][::7500]
    markH = data['Heading'][::7500]
    axisVec = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    
    fig = go.Figure(
        data=go.Scatter3d(
            x=x, y=y, z=z,
        marker=dict(
            size=0.5,
            colorscale='Viridis',
        ),
        line=dict(
            color='darkblue',
            width=0.5
        )
    )
    )
    
    for i in range(len(markX)):
        rollq = Quaternion(axis=[1, 0, 0], angle=markR[i])
        pitchq = Quaternion(axis=[0, 1, 0], angle=markP[i])
        yawq = Quaternion(axis=[0, 0, 1], angle=markH[i])
        rotateq = (yawq * pitchq * rollq)
        rotatedVec = np.array([rotateq.rotate(n) for n in axisVec])
        rotatedPt = np.array([rotatedVec[0] * 200, -rotatedVec[1] * 70 - rotatedVec[0] * 200, rotatedVec[1] * 70 - rotatedVec[0] * 200])
        finalPt = np.array([n + np.array([markY[i], markX[i], markZ[i]]) for n in rotatedPt])
        fig.add_trace(go.Mesh3d(z=finalPt[:,2], x=finalPt[:,1], y=finalPt[:,0], color = 'red', opacity = 1))
    
    fig.update_layout(
        width=800,
        height=700,
        scene=dict(
            xaxis_title="X Displacement (m)",
            yaxis_title="Y Displacement (m)",
            zaxis_title="Z Displacement (m)",
            camera=dict(
                up=dict(
                    x=0,
                    y=0,
                    z=1
                ),
                eye=dict(
                    x=0,
                    y=1.0707,
                    z=1,
                )
            ),
            aspectmode = 'data'
        ),
    )

    return [fig]



PRECALC_FILE_KWARG = kwargsHelper.getGrapherPrecalcFileKwarg()

GRAPHERS = {
    PRECALC_FILE_KWARG: [(trackplot, 'trackplot.html')],
}