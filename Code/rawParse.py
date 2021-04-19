#OUTPUT: fs Depth Heading Pitch Roll WhaleAccel_XYZ Accel_XYZ WhaleMag_XYZ Mag_XYZ
#Where is NanChecking?

import numpy as np
from scipy.io import loadmat
import pandas as pd
import datetime as dt

def matParse(fileString):
    #DTAG3
    try:
        df = loadmat(fileString)
        fileLength = len(df['A']) #Import Error Checking Here for mismatched lengths
        csvConvert = pd.DataFrame({'fs': np.repeat(df['fs'][0], fileLength), 
                                   'Depth': df['p'].T[0], 
                                   'Heading': df['head'].T[0],
                                   'Pitch': df['pitch'].T[0],
                                   'Roll': df['roll'].T[0],
                                   'WhaleAccel_X': df['Aw'][:,0],
                                   'WhaleAccel_Y': df['Aw'][:,1],
                                   'WhaleAccel_Z': df['Aw'][:,2],
                                   'Accel_X': df['A'][:,0],
                                   'Accel_Y': df['A'][:,1],
                                   'Accel_Z': df['A'][:,2],
                                   'WhaleMag_X': df['Mw'][:,0],
                                   'WhaleMag_Y': df['Mw'][:,1],
                                   'WhaleMag_Z': df['Mw'][:,2],
                                   'Mag_X': df['M'][:,0],
                                   'Mag_Y': df['M'][:,1],
                                   'Mag_Z': df['M'][:,2]})
        csvConvert.to_csv('.'.join(fileString.split('.')[0:-1] + ['csv']), index = False)
    except:
        pass
    #DTAG4
    try:
        df = loadmat(fileString)
        fileLength = len(df['A'][0][0][0]) #Import Error Checking Here for mismatched lengths
        csvConvert = pd.DataFrame({'fs': np.repeat(df['fs'][0], fileLength), 
                                   'Depth': df['p'].T[0], 
                                   'Heading': df['head'].T[0],
                                   'Pitch': df['pitch'].T[0],
                                   'Roll': df['roll'].T[0],
                                   'WhaleAccel_X': df['Aw'][:,0],
                                   'WhaleAccel_Y': df['Aw'][:,1],
                                   'WhaleAccel_Z': df['Aw'][:,2],
                                   'Accel_X': df['A'][0][0][0][:,0],
                                   'Accel_Y': df['A'][0][0][0][:,1],
                                   'Accel_Z': df['A'][0][0][0][:,2],
                                   'WhaleMag_X': df['Mw'][:,0],
                                   'WhaleMag_Y': df['Mw'][:,1],
                                   'WhaleMag_Z': df['Mw'][:,2],
                                   'Mag_X': df['M'][0][0][0][:,0],
                                   'Mag_Y': df['M'][0][0][0][:,1],
                                   'Mag_Z': df['M'][0][0][0][:,2]})
        csvConvert.to_csv('.'.join(fileString.split('.')[0:-1] + ['csv']), index = False)
    except:
        pass

    