# -*- coding: utf-8 -*-
"""
Created on Thu Sep 17 10:28:36 2020

@author: Vincent

References:
    https://plotly.com/python/animations/
    https://chart-studio.plotly.com/~empet/15434/mesh3d-with-intensitymodecell/#/
    https://plotly.com/python/visualizing-mri-volume-slices/
"""
import math
from scipy.io import loadmat
from plotly.offline import plot
import plotly.graph_objects as go
import numpy as np
import plotly.express as px
from stl import mesh
from mpl_toolkits import mplot3d
from matplotlib import pyplot
import plotly
import copy
from datetime import datetime
from pyquaternion import Quaternion


#%%Import Relevant Data and Clean
data = loadmat('../Data/gm14_279aprh.mat')
roll = data['roll']
pitch = data['pitch']
yaw = data['head']
accel = data['Aw']
accel_x = accel[:,0] * 1 #What Units is this in? (Currently assuming m/s)
accel_y = accel[:,1] * 1
accel_z = accel[:,2] * 1
length = 2000
v = np.array([[0, 0, 0]]) #Initial velocity in x, y, z
dx = np.array([[0, 0, 0]]) #Initial displacement in x, y, z
fs = 1/25
#%%Define Necessary Functions

def stl2mesh3d(stl_mesh):
    # stl_mesh is read by nympy-stl from a stl file; it is  an array of faces/triangles (i.e. three 3d points) 
    # this function extracts the unique vertices and the lists I, J, K to define a Plotly mesh3d
    p, q, r = stl_mesh.vectors.shape #(p, 3, 3)
    # the array stl_mesh.vectors.reshape(p*q, r) can contain multiple copies of the same vertex;
    # extract unique vertices from all mesh triangles
    vertices, ixr = np.unique(stl_mesh.vectors.reshape(p*q, r), return_inverse=True, axis=0)
    I = np.take(ixr, [3*k for k in range(p)])
    J = np.take(ixr, [3*k+1 for k in range(p)])
    K = np.take(ixr, [3*k+2 for k in range(p)])
    return vertices, I, J, K

def tri_area(verts, tri):
    #calculate the area of each mesh triangle 
    verts = np.asarray(verts)
    faces = np.asarray(tri)
    area = np.zeros(len(tri))
    p_triangles =  verts[tri]  # coordinates of triangle vertices

    for k, T in enumerate(p_triangles):
        a = np.linalg.norm(T[0] - T[1])
        b = np.linalg.norm(T[1] - T[2])
        c = np.linalg.norm(T[2] - T[0])
        p = (a+b+c) / 2
        area[k] = np.sqrt(p*(p-a)*(p-b)*(p-c))
    return area

def frame_args(duration):
    return {
            "frame": {"duration": duration},
            "mode": "immediate",
            "fromcurrent": True,
            "transition": {"duration": duration, "easing": "linear"},
        }


start = datetime.now() #Timer Start

#%%Create Velocity and Displacement Vectors using a Tacky Dead Reckoning System WIP
for i in range(length):
    #Creating a rotational matrix to transform a displament in the whale frame to a displacement in the inertial coordinate system
    rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
    pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
    yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
    rotateq = (rollq * pitchq * yawq).inverse
    #Update velocity step
    v = np.append(v, [[v[i][0] + accel_x[i] * fs, v[i][1] + accel_y[i] * fs, v[i][2] + accel_z[i] * fs]], axis = 0)
    #Update displacement step and apply rotation matrix
    step = np.array([v[i][0] * fs, v[i][1] * fs, v[i][2] * fs])
    step = rotateq.rotate(step)
    #Calculate new displacement for the current step
    dx = np.append(dx, [[dx[i][0] + step[0], dx[i][1] + step[1], dx[i][2] + step[2]]], axis = 0)


#%%Code to Calculate STL Vertices for Each Frame ***TIME LIMITING STEP -- CUT DOWN ON COMPUTATION TIME HERE***
vertices = []
I = []
J = []
K = []
triangles = []
x = []
y = []
z = []
for i in range(length):
    tempmesh = mesh.Mesh.from_file('whale.stl')
# Normal MatMul
# =============================================================================
#     rollmat = tempmesh.rotation_matrix([1, 0, 0], roll[i])
#     pitchmat = tempmesh.rotation_matrix([0, 1, 0], pitch[i])
#     yawmat = tempmesh.rotation_matrix([0, 0, 1], yaw[i])
#     tempmat = np.matmul(rollmat, pitchmat)
#     rotation_matrix = np.matmul(tempmat, yawmat)
# =============================================================================
# Quaternions
    rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
    pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
    yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
    rotateq = rollq * pitchq * yawq

    tempmesh.rotate_using_matrix(rotateq.rotation_matrix)
    t_vertices, t_I, t_J, t_K = stl2mesh3d(tempmesh) #Slowest Step
    vertices.append(t_vertices)
    I.append(t_I)
    J.append(t_J)
    K.append(t_K)
    t_triangles = np.stack((t_I,t_J,t_K)).T
    triangles.append(t_triangles)
    t_x, t_y, t_z = t_vertices.T
    x.append(t_x)
    y.append(t_y)
    z.append(t_z)
    
marker1 = datetime.now()
print("Marker 1", marker1 - start) #Marker 1

#%% Graph Figure Animation Using Plotly
fig = go.Figure(data = [go.Mesh3d(x=x[0], y=y[0], z=z[0], i=I[0], j=J[0], k=K[0]
# ============================================================================= For Coloring
#                           , colorscale='deep' ,
#                           colorbar_len=0.85, colorbar_thickness=25,
#                           intensity=tri_area(vertices, triangles),   
#                           intensitymode='cell',
#                           flatshading=True, 
#                           lighting = dict(ambient=0.5,
#                                           diffuse=1,
#                                           fresnel=4,        
#                                           specular=0.5,
#                                           roughness=0.05,
#                                           facenormalsepsilon=0),
#                           lightposition=dict(x=100,
#                                              y=100,
#                                              z=10000)
# =============================================================================
                        )],
            frames=[
                        go.Frame(
                            data=
                                go.Mesh3d(x=x[i], y=y[i], z=z[i], 
                          i=I[i], j=J[i], k=K[i]
                                ), name = str(i)
                        ) for i in range(length)
                        
                   ]
    )

marker2 = datetime.now()
print("Marker 2", marker2 - marker1) #Marker 3

sliders = [
            {
                "pad": {"b": 10, "t": 60},
                "len": 0.9,
                "x": 0.1,
                "y": 0,
                "steps": [
                    {
                        "args": [[f.name], frame_args(0)],
                        "label": str(k),
                        "method": "animate",
                    }
                    for k, f in enumerate(fig.frames)
                ],
            }
        ]

marker3 = datetime.now()
print("Marker 3", marker3 - marker2) #Marker 3

fig.update_layout(width=700, height=700, yaxis=dict(scaleanchor="x", scaleratio=1),
                   scene=dict(camera=dict(eye=dict(x=1.15, y=1.15, z=0.8)), #the default values are 1.25, 1.25, 1.25
                   xaxis=dict(range=[-150, 150], autorange=False),
                   yaxis=dict(range=[-150, 150], autorange=False),
                   zaxis=dict(range=[-150, 150], autorange = False),
                   aspectmode='manual', #this string can be 'data', 'cube', 'auto', 'manual'
                   #a custom aspectratio is defined as follows:
                   aspectratio=dict(x=1, y=1, z=1)
                   ),
                  title='Mesh3d with face area as  cell intensity', title_x=0.5,
                  template='plotly_dark',
                  sliders = sliders);



plot(fig)