import pandas as pd
from datetime import datetime
from scipy.io import loadmat
import sys
import re
name = input('Filename: ')
data = loadmat(name)
#Note-These lines are hardcoded in since it seems like the 'A' and 'M' vars are sometimes wrapped in a few layers of matrices? The number seems to be arbitrary (hence 25/26), and may need to find a better soln
#Try with tag date and formats?
#Send data to Dr. Nowacek
while len(data['A']) == 1 or len(data['A']) == 25:
    data['A'] = data['A'][0]
while len(data['M']) == 1 or len(data['M']) == 26:
    data['M'] = data['M'][0]
    
d = {'fs': data['fs'][0,0], 'Depth': data['p'][:,0], 'Heading': data['head'][:,0], 'Pitch': data['pitch'][:,0], 'Roll': data['roll'][:,0], 'WhaleAccel_X': data['Aw'][:,0], 'WhaleAccel_Y': data['Aw'][:,1], 'WhaleAccel_Z': data['Aw'][:,2], 'Accel_X': data['A'][:,0], 'Accel_Y': data['A'][:,1], 'Accel_Z': data['A'][:,2], 'WhaleMag_X': data['Mw'][:,0], 'WhaleMag_Y': data['Mw'][:,1], 'WhaleMag_Z': data['Mw'][:,2], 'Mag_X': data['M'][:,0], 'Mag_Y': data['M'][:,1], 'Mag_Z': data['M'][:,2]}
df = pd.DataFrame(data=d).dropna() #Note-Currently not accounting for any NA in the middle of the file - I assume there probably shouldn't be any NA in the middle of the data, but not sure, may want to make a failsafe here
                                    #Note 2-If the start log file accounts for the NA values when determining start time, this code will need to be modded a bit
                                    #Not impossible for middle NaN, will need to account for it
df.to_csv('.'.join(name.split('.')[0:-1]) + '.csv', index = False)
