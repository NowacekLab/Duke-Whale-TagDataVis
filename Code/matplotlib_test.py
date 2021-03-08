"""
3D Graphers called in html3D.py 
"""

#Vincent Note:
    #Make the decimate parameter an input rather than hardcoded as 10? (Lines 29-31-ish)

from pyquaternion import Quaternion
from datetime import datetime
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd 
<<<<<<< Updated upstream
import mpl_toolkits.axes_grid1
import matplotlib.widgets
=======

>>>>>>> Stashed changes
from mpl_toolkits import mplot3d
from matplotlib.animation import FuncAnimation
import matplotlib.animation as animation
    
<<<<<<< Updated upstream
class Player(FuncAnimation):
    def __init__(self, fig, func, frames=None, init_func=None, fargs=None,
                 save_count=None, mini=0, maxi=100, pos=(0.125, 0.92), **kwargs):
        self.i = 0
        self.min=mini
        self.max=maxi
        self.runs = True
        self.forwards = True
        self.fig = fig
        self.func = func
        self.setup(pos)
        FuncAnimation.__init__(self,self.fig, self.update, frames=self.play(), 
                                           init_func=init_func, interval=40, fargs=fargs,
                                           save_count=save_count, **kwargs )    

    def play(self):
        while self.runs:
            self.i = self.i+self.forwards-(not self.forwards)
            if self.i > self.min and self.i < self.max:
                yield self.i
            else:
                self.stop()
                yield self.i

    def start(self):
        self.runs=True
        self.event_source.start()

    def stop(self, event=None):
        self.runs = False
        self.event_source.stop()

    def forward(self, event=None):
        self.forwards = True
        self.start()
    def backward(self, event=None):
        self.forwards = False
        self.start()
    def oneforward(self, event=None):
        self.forwards = True
        self.onestep()
    def onebackward(self, event=None):
        self.forwards = False
        self.onestep()

    def onestep(self):
        if self.i > self.min and self.i < self.max:
            self.i = self.i+self.forwards-(not self.forwards)
        elif self.i == self.min and self.forwards:
            self.i+=1
        elif self.i == self.max and not self.forwards:
            self.i-=1
        self.func(self.i)
        self.slider.set_val(self.i)
        self.fig.canvas.draw_idle()

    def setup(self, pos):
        playerax = self.fig.add_axes([pos[0],pos[1], 0.64, 0.04])
        divider = mpl_toolkits.axes_grid1.make_axes_locatable(playerax)
        bax = divider.append_axes("right", size="80%", pad=0.05)
        sax = divider.append_axes("right", size="80%", pad=0.05)
        fax = divider.append_axes("right", size="80%", pad=0.05)
        ofax = divider.append_axes("right", size="100%", pad=0.05)
        sliderax = divider.append_axes("right", size="500%", pad=0.07)
        self.button_oneback = matplotlib.widgets.Button(playerax, label='$\u29CF$')
        self.button_back = matplotlib.widgets.Button(bax, label='$\u25C0$')
        self.button_stop = matplotlib.widgets.Button(sax, label='$\u25A0$')
        self.button_forward = matplotlib.widgets.Button(fax, label='$\u25B6$')
        self.button_oneforward = matplotlib.widgets.Button(ofax, label='$\u29D0$')
        self.button_oneback.on_clicked(self.onebackward)
        self.button_back.on_clicked(self.backward)
        self.button_stop.on_clicked(self.stop)
        self.button_forward.on_clicked(self.forward)
        self.button_oneforward.on_clicked(self.oneforward)
        self.slider = matplotlib.widgets.Slider(sliderax, '', 
                                                self.min, self.max, valinit=self.i)
        self.slider.on_changed(self.set_pos)

    def set_pos(self,i):
        self.i = int(self.slider.val)
        self.func(self.i)

    def update(self,i):
        self.slider.set_val(i)


=======
>>>>>>> Stashed changes
def trackplot(calc_file_path: str): #Multiple ways to do this; for now, I'm just using two inputs because it's easier for testing.
    
    Writer = animation.writers['ffmpeg']
    writer = Writer(fps=15, metadata=dict(artist='Me'), bitrate=1800)

<<<<<<< Updated upstream
    dcf = 20
=======
    dcf = 100
>>>>>>> Stashed changes
    csv = pd.read_csv(calc_file_path)
    data = csv.to_dict(orient = 'list')    
    x = np.array(data['X Position'])
    y = np.array(data['Y Position'])
    z = np.array(data['Z Position'])
    time = [datetime.strptime(date, "%Y-%m-%d %H:%M:%S.%f") for date in data['Time']]
    seconds = [(i-time[0]).total_seconds() for i in time]
    length = len(x)
    frameNum = (length // dcf) - 1
    print(frameNum)
    
    fig = plt.figure()
    gs = fig.add_gridspec(3, 2)
    ax = fig.add_subplot(gs[1:3, 0:2], projection = '3d')
    ax_xy = fig.add_subplot(gs[0, 0])
    ax_d = fig.add_subplot(gs[0, 1])
    
    # max_range = np.array([x.max()-x.min(), y.max()-y.min(), z.max()-z.min()]).max()
    # Xb = 0.5*max_range*np.mgrid[-1:2:2,-1:2:2,-1:2:2][0].flatten() + 0.5*(x.max()+x.min())
    # Yb = 0.5*max_range*np.mgrid[-1:2:2,-1:2:2,-1:2:2][1].flatten() + 0.5*(y.max()+y.min())
    # Zb = 0.5*max_range*np.mgrid[-1:2:2,-1:2:2,-1:2:2][2].flatten() + 0.5*(z.max()+z.min())
    # # Comment or uncomment following both lines to test the fake bounding box:
    # for xb, yb, zb in zip(Xb, Yb, Zb):
    #    ax.plot([xb], [yb], [zb], 'w')
    
    markX = data['X Position'][::dcf]
    markY = data['Y Position'][::dcf]
    markZ = data['Z Position'][::dcf]
    markR = data['Roll'][::dcf]
<<<<<<< Updated upstream
    markP = -1 * np.array(data['Pitch'][::dcf])
=======
    markP = data['Pitch'][::dcf]
>>>>>>> Stashed changes
    markH = data['Heading'][::dcf]
    axisVec = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    
    ax.plot3D(x, y, z, color = '#014AFD')
    ax.set_xlabel('X Position (m)')
    ax.set_ylabel('Y Position (m)')
    ax.set_zlabel('Z Position (m)')
    
    ax_d.plot(seconds, z, color = '#08DE86')
    line_d, = ax_d.plot([], [], 'ko', markersize = 5)
    ax_d.set_xlabel('Time (s)')
    ax_d.set_ylabel('Depth (m)')    
    
    ax_xy.plot(x, y, color = '#01FDF4')
    line_xy, = ax_xy.plot([], [], 'ko', markersize = 5)
    ax_xy.set_xlabel('X Position (m)')
    ax_xy.set_ylabel('Y Position (m)')
    
    
    mesh = None
    
    def update(i: int):
        print(i)
        nonlocal mesh
        if mesh:
            ax.collections.remove(mesh)
        rollq = Quaternion(axis=[1, 0, 0], angle=markR[i])
        pitchq = Quaternion(axis=[0, 1, 0], angle=markP[i])
        yawq = Quaternion(axis=[0, 0, 1], angle=markH[i])
        rotateq = (yawq * pitchq * rollq)
        rotatedVec = np.array([rotateq.rotate(n) for n in axisVec])
        rotatedPt = np.array([rotatedVec[0] * 200, -rotatedVec[1] * 70 - rotatedVec[0] * 200, rotatedVec[1] * 70 - rotatedVec[0] * 200])
        finalPt = np.array([n + np.array([markY[i], markX[i], markZ[i]]) for n in rotatedPt])
        #ax.view_init(30,np.random.randint(0, 360))
        line_d.set_data(seconds[i * dcf], markZ[i])
        line_xy.set_data(markX[i], markY[i])
        mesh = ax.plot_trisurf(finalPt[:,1], finalPt[:,0], finalPt[:,2], color = 'red')

        ax.set_xlim(markX[i] - 400, markX[i] + 400)
        ax.set_ylim(markY[i] - 400, markY[i] + 400)
        ax.set_zlim(markZ[i] - 400, markZ[i] + 400)
        return mesh, line_d, line_xy
<<<<<<< Updated upstream
#%%Interactive
    ani = Player(fig, update, maxi=frameNum)

    plt.show()

#%%MP4
    #anim = FuncAnimation(fig, update,
    #                           frames=frameNum, interval=50, blit=True)

    #fig.set_size_inches(16, 9, True)
    #anim.save('.'.join(calc_file_path.split(".")[0:-1]) + '.mp4', writer=writer)
=======

    anim = FuncAnimation(fig, update,
                               frames=frameNum, interval=50, blit=True)

    fig.set_size_inches(16, 9, True)
    anim.save('.'.join(calc_file_path.split(".")[0:-1]) + '.mp4', writer=writer)
>>>>>>> Stashed changes
