import pandas as pd
from datetime import datetime
from scipy.io import loadmat
import sys
import re
name = input('Filename: ')
data = loadmat(name)
d = {'fs': data['fs'][0,0], 'Depth': data['p'][:,0], 'Heading': data['head'][:,0], 'Pitch': data['pitch'][:,0], 'Roll': data['roll'][:,0], 'WhaleAccel_X': data['Aw'][:,0], 'WhaleAccel_Y': data['Aw'][:,1], 'WhaleAccel_Z': data['Aw'][:,2], 'Accel_X': data['A'][:,0], 'Accel_Y': data['A'][:,1], 'Accel_Z': data['A'][:,2], 'WhaleMag_X': data['Mw'][:,0], 'WhaleMag_Y': data['Mw'][:,1], 'WhaleMag_Z': data['Mw'][:,2], 'Mag_X': data['M'][:,0], 'Mag_Y': data['M'][:,1], 'Mag_Z': data['M'][:,2]}
df = pd.DataFrame(data=d)
df.to_csv('.'.join(name.split('.')[0:-1]) + '.csv', index = False)
