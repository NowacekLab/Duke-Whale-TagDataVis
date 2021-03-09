# -*- coding: utf-8 -*-
"""
Created on Wed Oct 14 10:36:40 2020

@author: Vincent
"""
from scipy.io import loadmat
import numpy as np
import matplotlib.pyplot as plt
from pyquaternion import Quaternion

data = loadmat('../Data/Pm19_136aprh.mat')
roll = data['roll']
pitch = data['pitch']
yaw = data['head']
accel = data['Aw']
accel_x = accel[:,0] * 9.81 # X Data in m/s^2
accel_y = accel[:,1] * 9.81 # Y Data in m/s^2
accel_z = accel[:,2] * 9.81 # Z Data in m/s^2
length = 20000
v = np.array([[0, 0, 0]]) #Initial velocity in xW, yW, zW
dx = np.array([[0, 0, 0]]) #Initial displacement in x, y, z
fs = 1/50
t = np.linspace(0, length * fs, length + 1)

for i in range(length):
    #Creating a rotational matrix to transform a displament in the whale frame to a displacement in the inertial coordinate system
    rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
    pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
    yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
    rotateq = (rollq * pitchq * yawq).inverse
    
    #Update velocity step
    v = np.append(v, [[v[i][0] + accel_x[i] * fs, 
                       v[i][1] + accel_y[i] * fs, 
                       v[i][2] + accel_z[i] * fs]], axis = 0)
    
    #Update displacement step and apply rotation matrix
    step = np.array([v[i][0] * fs, 
                     v[i][1] * fs, 
                     v[i][2] * fs])
    
    step = rotateq.rotate(step)
    
    #Calculate new displacement for the current step
    dx = np.append(dx, [[dx[i][0] + step[0], 
                         dx[i][1] + step[1], 
                         dx[i][2] + step[2]]], axis = 0)


plt.plot(t, dx[:,0])