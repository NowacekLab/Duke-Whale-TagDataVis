# Import data
import time
import numpy as np
from plotly.offline import plot
from skimage import io
from pyquaternion import Quaternion
from scipy.io import loadmat

data = loadmat('../Data/Pm19_136aprh.mat')
roll = data['roll']
pitch = data['pitch']
yaw = data['head']
length = 2000

direction = []
for i in range(length):
    forward_vector = [1, 0, 0]
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
    direction.append(rotateq.rotate(forward_vector))
    

# Define frames
import plotly.graph_objects as go

fig = go.Figure(frames=[go.Frame(data=[
    go.Mesh3d(
        # 8 vertices of a cube
        x=[-1, -1, 1, 1, -1, -1, 1, 1],
        y=[-1, 1, 1, -1, -1, 1, 1, -1],
        z=[-1, -1, -1, -1, 1, 1, 1, 1],
        colorbar_title='z',
        colorscale=[[0, 'gold'],
                    [0.5, 'mediumturquoise'],
                    [1, 'magenta']],
        # Intensity of each vertex, which will be interpolated and color-coded
        intensity = np.linspace(0, 1, 8, endpoint=True),
        # i, j and k give the vertices of triangles
        i = [7, 0, 0, 0, 4, 4, 6, 6, 4, 0, 3, 2],
        j = [3, 4, 1, 2, 5, 6, 5, 2, 0, 1, 6, 3],
        k = [0, 7, 2, 3, 6, 7, 1, 1, 5, 5, 7, 6],
        name='y',
        showscale=True
    )
],
        name=str(k),
        layout=go.Layout(
            scene = dict(
            xaxis = dict(nticks=4, range=[-1, 1],),
            yaxis = dict(nticks=4, range=[-1, 1],),
            zaxis = dict(nticks=4, range=[-1, 1],),),
            scene_camera = dict(
            up=dict(x=0, y=0, z=1),
            center=dict(x=5*direction[k][0], y=5*direction[k][1], z=5*direction[k][2]),
            eye=dict(x=0, y=0, z=0)
            ))# you need to name the frame for the animation to behave properly
        )
        for k in range(length)])

# Add data to be displayed before animation starts
fig.add_trace(go.Scatter3d(x=[1], y=[1], z=[1]))


def frame_args(duration):
    return {
            "frame": {"duration": duration},
            "mode": "immediate",
            "fromcurrent": True,
            "transition": {"duration": duration, "easing": "linear"},
        }

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

# Layout
fig.update_layout(
         title='Slices in volumetric data',
         width=600,
         height=600,
         scene=dict(
                    zaxis=dict(range=[-0.1, 6.8], autorange=False),
                    aspectratio=dict(x=1, y=1, z=1),
                    ),
         updatemenus = [
            {
                "buttons": [
                    {
                        "args": [None, frame_args(1)],
                        "label": "&#9654;", # play symbol
                        "method": "animate",
                    },
                    {
                        "args": [[None], frame_args(0)],
                        "label": "&#9724;", # pause symbol
                        "method": "animate",
                    },
                ],
                "direction": "left",
                "pad": {"r": 10, "t": 70},
                "type": "buttons",
                "x": 0.1,
                "y": 0,
            }
         ],
         sliders=sliders
)

plot(fig)