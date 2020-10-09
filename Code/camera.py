import numpy as np
from plotly.offline import plot

def get_random_data(N):
    return np.random.random(N), np.random.random(N), np.random.random(N)
def make_fig(camera, name, N=40):
    x1, y1, z1 = get_random_data(N)

    trace1 = dict(
        type= 'scatter3d',
        x=x1,
        y=y1,
        z=z1,
        mode='markers'
    )

    layout = dict(
        title='camera controls - {}'.format(name),
        scene=dict(
            camera=camera
        )
    )

    fig = dict(data=[trace1], layout=layout)
    return fig


name = 'eye = (x:2, y:2, z:0.1)'
camera = dict(
    up=dict(x=0, y=0, z=1),
    center=dict(x=1, y=1, z=1),
    eye=dict(x=0, y=0, z=0)
)


fig = make_fig(camera, name)
plot(fig, validate=False)