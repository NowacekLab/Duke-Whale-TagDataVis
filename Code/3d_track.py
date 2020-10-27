# -*- coding: utf-8 -*-
"""
Created on Wed Oct 14 10:36:40 2020

@author: Vincent
"""
from scipy.io import loadmat
import numpy as np
import matplotlib.pyplot as plt
from pyquaternion import Quaternion
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot

def trackplot(filename):
    data = loadmat(filename)
    roll = data['roll']
    pitch = data['pitch']
    yaw = data['head']
    accel = data['Aw']
    accel_x = accel[:,0] * 9.81 # X Data in m/s^2
    accel_y = accel[:,1] * 9.81 # Y Data in m/s^2
    accel_z = accel[:,2] * 9.81 # Z Data in m/s^2
    length = len(accel_x)
    v = np.zeros([length + 1, 3]) #Initial velocity in xW, yW, zW
    v[0] = [5, 0, 0]
    dx = np.zeros([length + 1, 3]) #Initial displacement in x, y, z
    fs = 1/50
    t = np.linspace(0, length * fs, length + 1)
    
    start = datetime.now()
    starttime = np.zeros([length, 1])
    
    for i in range(length):
        print(i)
        #Creating a rotational matrix to transform a displament in the whale frame to a displacement in the inertial coordinate system
        rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
        pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
        yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
        rotateq = (yawq * pitchq * rollq).inverse
        #Update velocity step
        v[i+1] = [v[i][0] + accel_x[i] * fs, 
                           v[i][1] + accel_y[i] * fs, 
                           v[i][2] + accel_z[i] * fs]
        #Update displacement step and apply rotation matrix
        step = [v[i][0] * fs, 
                v[i][1] * fs, 
                v[i][2] * fs]
        step = rotateq.rotate(step)
        #Calculate new displacement for the current step
        dx[i+1] = [dx[i][0] + step[0], 
                             dx[i][1] + step[1], 
                             dx[i][2] + step[2]]
        starttime[i] = (datetime.now() - start).total_seconds()
    fig = go.Figure(data=go.Scatter3d(
        x=dx[:,0][0::50], y=dx[:,1][0::50], z=dx[:,2][0::50],
        marker=dict(
            size=0.1,
            colorscale='Viridis',
        ),
        line=dict(
            color='darkblue',
            width=1
        )
    ))
    
    fig.update_layout(
        width=800,
        height=700,
        autosize=False,
        scene=dict(
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
            aspectratio = dict( x=1, y=1, z=0.7 ),
            aspectmode = 'manual'
        ),
    )
    fig.write_html('.'.join(filename.split('.')[0:-1]) + '.html')

if __name__ == '__main__':
    trackplot('../Data/Pm19_136aprh.mat')
    