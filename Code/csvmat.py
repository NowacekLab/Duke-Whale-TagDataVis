import pandas as pd
from scipy.io import loadmat
name = input('Filename: ')
data = loadmat(name)
d = {'Heading': data['head'][:,0], 'Pitch': data['pitch'][:,0], 'Roll': data['roll'][:,0], 'Accel_X': data['Aw'][:,0], 'Accel_Y': data['Aw'][:,1], 'Accel_Z': data['Aw'][:,2]}
df = pd.DataFrame(data=d)
df.to_csv(r'Name.csv', index = False)