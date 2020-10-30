# -*- coding: utf-8 -*-
"""
Created on Thu Oct 29 04:16:54 2020

@author: Vincent
"""

from scipy.io import loadmat
import numpy as np
import matplotlib.pyplot as plt
from pyquaternion import Quaternion
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot

data = loadmat('../Data/Pm19_136aprh.mat')
roll = data['roll']
pitch = data['pitch']
yaw = data['head']
accelW = data['Aw']
accel_x = accelW[:,0] * 9.81 # X Data in m/s^2
accel_y = accelW[:,1] * 9.81 # Y Data in m/s^2
accel_z = accelW[:,2] * 9.81 # Z Data in m/s^2
depth = data['p']
length = 200000
v = np.zeros([length + 1, 3]) #Initial velocity in xW, yW, zW
v[0] = [5, 0, 0]
dx = np.zeros([length + 1, 3]) #Initial displacement in x, y, z
z = np.zeros(length + 1)
fs = 1/50
t = np.linspace(0, length * fs, length + 1)
p = np.zeros(length + 1)
p[0] = 25 #Error in Initial Guess (Default = 25)
for i in range(length):
    print(i)
    #Creating a rotational matrix to transform a displament in the whale frame to a displacement in the inertial coordinate system
    #Creating a rotational matrix to transform a displament in the whale frame to a displacement in the inertial coordinate system
    rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
    pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
    yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
    rotateq = (yawq * pitchq * rollq).inverse
    #Update displacement step and apply rotation matrix
    step = [v[i][0] * fs, 
            v[i][1] * fs, 
            v[i][2] * fs]
    step = rotateq.rotate(step)

    
#%% Begin Filter
    v[i+1] = [v[i][0] + accel_x[i] * fs, 
                       v[i][1] + accel_y[i] * fs, 
                       v[i][2] + accel_z[i] * fs]
    
    step = [v[i][0] * fs, 
        v[i][1] * fs, 
        v[i][2] * fs]
    step = rotateq.rotate(step)
    #Calculate new displacement for the current step
    z_estimate = z[i] + step[2]
    p_estimate = p[i] + 100 #Updated Estimate with Error in Prediction (Default = 100)
    r = 1 #Error in Measurement (Default = 1)
    K = p_estimate / (p_estimate + r)
    z[i + 1] = z_estimate + K * (depth[i] - z_estimate)
    p[i + 1] = (1 - K) * p_estimate
    
plt.plot(np.linspace(0, length, length), data['p'][0:200000], label = 'True')
plt.plot(np.linspace(0, length + 1, length + 1), z, label = 'Prediction')
plt.legend()
