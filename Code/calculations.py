from scipy.io import loadmat
import numpy as np
from pyquaternion import Quaternion
import matplotlib.pyplot as plt
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot
from scipy.signal import decimate as dc
import pandas as pd

def calculation(filename):
    csv = pd.read_csv(filename)
    data = csv.to_dict(orient = 'list')
    roll = np.array(data['Roll'])
    pitch = np.array(data['Pitch'])
    yaw = np.array(data['Heading'])
    depth = np.array(data['Depth']) * -1
    accel_x = np.array(data['WhaleAccel_X']) * 9.81 # X Data in m/s^2
    accel_y = np.array(data['WhaleAccel_Y']) * 9.81 # Y Data in m/s^2
    accel_z = np.array(data['WhaleAccel_Z']) * 9.81 # Z Data in m/s^2
    length = len(accel_x)
    v = 2.2 #Initial velocity in xW, yW, zW
    dx = np.zeros([length + 1, 2]) #Initial displacement in x, y
    fs = 1/50
    t = np.linspace(0, length * fs, length + 1)
    forward_vec = np.array([1, 0, 0])
    
    for i in range(length):
        rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
        pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
        yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
        rotateq = (yawq * pitchq * rollq)
        direc = rotateq.rotate(forward_vec)
        project_vec = np.array([direc[0], direc[1], 0])
        angle = np.arccos(np.dot(direc, project_vec) / (np.linalg.norm(project_vec)))
        dv = v * np.sin(angle)
        print(i)
        #Calculate new displacement for the current step
        dx[i + 1] = [(dv * np.cos(yaw[i])) * fs + dx[i][0], (dv * np.sin(yaw[i])) * fs + dx[i][1]]
    
    csv['X Position'] = dx[:-1, 0]
    csv['Y Position'] = dx[:-1, 1]
    csv['Z Position'] = depth
    csv.to_csv('.'.join(filename.split('.')[0:-1]) + '_calculations.csv', index = False)
    
if __name__ == "__main__":
    calculation('../Data/Pm19_136aprh.csv')