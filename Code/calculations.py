#%% Vincent's Notes and Stuff
#NOTE - ONLY ACCOUNTS FOR NORTH AND WEST LAT LONGS CURRENTLY
#NOTE - logProcessStarttime assumes that the relevant starttime entry is the first entry
#NOTE - XML is assumed UTC, txt is assumed UTC-4
#TO UNDO - Length Change, Starttime Change, Export as CSV Change
#TO DO - Fix N/W/E/S for Haversine
    #Add R2 Metric for time alignment check
    #Add option for manual selection of timezone
    #Make 3d Track mesh
    #Add optional input for maxVelocityScale
    #Add date column to calculations
    #Ask about more plots? (Next week)
#Questions - Time Discrepancy Between GPS and Tag Start Date? Force Fit to GPS_Z as well if Values Don't fit exactly? Or should I do a 1-hour starttime sweep?
            #-Just confirming, 0/0/0 RPY is a flat whale facing due north? -Ans, Yes
            #-I assume there's no easy way to get the start long/lat at tag time = 0? -Ans, may have a datasheet

#%%
import xml.dom.minidom
import numpy as np
from pyquaternion import Quaternion
import matplotlib.pyplot as plt
import datetime
import plotly.graph_objects as go
from plotly.offline import plot
from scipy.signal import decimate as dc
import pandas as pd
import re

#Haversine Function for Calculating Distance Between Two Lat. Long. Pts. (VW)
def haversine(lat1, long1, lat2, long2):
    lat1 = lat1 * np.pi / 180
    lat2 = lat2 * np.pi / 180
    long1 = long1 * np.pi / 180
    long2 = long2 * np.pi / 180
    dlat = lat2 - lat1
    dlong = long2 - long1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlong / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return c * 6371000

#Calculate X-Y Displacement Between Two Lat. Long. Pts. (VW)
def xydistance(lat1, long1, lat2, long2):
    x1 = haversine(lat1, long1, lat1, long2)
    if(long2 > long1): #Direcional Correction Factors to convert 
        x1 = -x1
    y1 = haversine(lat1, long1, lat2, long1)
    if(lat1 > lat2):
        y1 = -y1
    x2 = haversine(lat2, long1, lat2, long2)
    if(long2 > long1):
        x2 = -x2
    y2 = haversine(lat1, long2, lat2, long2)
    if(lat1 > lat2):
        y2 = -y2
    return (x1+x2)/2, (y1+y2)/2

    

#Calculate Tag Start Time
def logProcessStarttime(logname):
    ext = logname.split('.')[-1]
    if ext == 'txt':
        log = open(logname, 'r').read()
        intTime = int(re.findall('[0-9a-f]{8}', log)[0], 16)
        originTime = datetime.datetime(1900, 1, 1, 0, 0, 0)
        deltaTime = datetime.timedelta(seconds = intTime)
        startTime = originTime + deltaTime + datetime.timedelta(hours = 4) #HARDCODED FROM UTC-4 TO UTC
    elif ext == 'xml':
        DOMTree = xml.dom.minidom.parse(logname)
        collection = DOMTree.documentElement
        collection.getElementsByTagName("EVENT")
        dateStr = collection.getElementsByTagName("EVENT")[0].getAttribute('TIME')
        startTime = datetime.datetime.strptime(dateStr, '%Y,%m,%d,%H,%M,%S')
    else:
        print('Log filetype error: only .xml and .txt expected')
        return 0
    return startTime
    

#Calculation of X-Y-Z Position with GPS Fitting and Appending to .csv
def calculation(filename, logname, gpsname=''):
    #Process .csv
    csv = pd.read_csv(filename)
    data = csv.to_dict(orient = 'list')
    roll = np.array(data['Roll'])
    pitch = np.array(data['Pitch'])
    yaw = np.array(data['Heading'])
    depth = np.array(data['Depth']) * -1
    accel_x = np.array(data['WhaleAccel_X'])
    accel_y = np.array(data['WhaleAccel_Y'])
    accel_z = np.array(data['WhaleAccel_Z'])
    length = len(depth)
    v = 2.2 #Initial velocity in xW, yW, zW
    maxVelocityScale = 5 #Calculate Rough Maximum Velocity Possible for Error Catching
    dx = np.zeros([length + 1, 2]) #Initial displacement in x, y
    #initialize jerk as 3-d 0 vectors
    j=np.zeros([length , 3])
    fs = max(csv['fs'])
    ts = 1 / fs
    t = np.linspace(0, length * ts, length + 1)
    forward_vec = np.array([0, 1, 0])
    startTime = logProcessStarttime(logname)
    
#%% GPS File Not Included, Calculate Manually
    if(gpsname == ''):
        for i in range(length):
            rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
            pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
            yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
            rotateq = (yawq * pitchq * rollq)
            direc = rotateq.rotate(forward_vec)
            project_vec = np.array([direc[0], direc[1], 0])
            angle = np.arccos(np.dot(direc, project_vec) / (np.linalg.norm(project_vec)))
            dv = v * np.cos(angle)
            print(i)
            #Calculate new displacement for the current step
            dx[i + 1] = [(dv * np.sin(yaw[i])) * ts + dx[i][0], (dv * np.cos(yaw[i])) * ts + dx[i][1]] #CHECK THIS STEPPPPPPPP
            #fill in jerk for each step, skip first step & leave it as 0
            if (i!=0):
                j[i]=[(accel_x[i]-accel_x[i-1])/fs,(accel_y[i]-accel_y[i-1])/fs,(accel_z[i]-accel_z[i-1])/fs]

#%% GPS File Included, Fit to GPS Data
    if(gpsname != ''):
        # Calculate and Reformat GPS Data
        gps = pd.read_excel(gpsname)
        dates = [datetime.datetime.strptime(i, '%Y-%m-%dT%H:%M:%S') for i in gps['Date Created'].to_numpy()]
        timepass = [(i - startTime).seconds for i in dates]
        gps['Time'] = timepass
        gps = gps[gps.FocalAvailability == 'Visual']
        latdata = gps['Location (Latitude)'].to_numpy()
        longdata = gps['Location (Longitude)'].to_numpy() 
        latdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in latdata]
        longdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in longdata]
        startlat = latdata[0]
        startlong = longdata[0]
        gps_xydata = np.array([xydistance(startlat, startlong, latdata[i], longdata[i]) for i in range(0, len(latdata))])
        gps_xydata[:,0] = gps_xydata[:,0] + np.sin(gps['Bearing(MAGNETIC!)'].to_numpy() * np.pi / 180) * gps['Range(m)'].to_numpy()
        gps_xydata[:,1] = gps_xydata[:,1] + np.cos(gps['Bearing(MAGNETIC!)'].to_numpy() * np.pi / 180) * gps['Range(m)'].to_numpy()
        gps['XDisplacement'] = gps_xydata[:,0]
        gps['YDisplacement'] = gps_xydata[:,1]
        gps = gps.dropna(subset=['XDisplacement', 'YDisplacement'])
    
        # Create XY Data and Fit to GPS Data
        currentGPSTime = 0
        lastGPSIndex = 0
        for i in range(length):
            rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
            pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
            yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
            rotateq = (yawq * pitchq * rollq)
            direc = rotateq.rotate(forward_vec)
            project_vec = np.array([direc[0], direc[1], 0])
            angle = np.arccos(np.dot(direc, project_vec) / (np.linalg.norm(project_vec)))
            dv = v * np.cos(angle)
            #print(i)
            #Calculate new displacement for the current step
            dx[i + 1] = [(dv * np.sin(yaw[i])) * ts + dx[i][0], (dv * np.cos(yaw[i])) * ts + dx[i][1]] #CHECK THIS STEPPPPPPPP
            if (currentGPSTime < len(gps['Time'].to_numpy())) and (t[i] >= gps['Time'].to_numpy()[currentGPSTime]): # DO EDGE CASE CHECKING FOR THIS LINE AND BELOW
                #calcDepth = calcDepth + [depth[i]]    
                if currentGPSTime == 0:
                    baseX = 0
                    baseY = 0
                else:
                    baseX = gps['XDisplacement'].to_numpy()[currentGPSTime - 1]
                    baseY = gps['YDisplacement'].to_numpy()[currentGPSTime - 1]
                xScale = (gps['XDisplacement'].to_numpy()[currentGPSTime] - baseX) / (dx[i + 1][0] - baseX)
                yScale = (gps['YDisplacement'].to_numpy()[currentGPSTime] - baseY) / (dx[i + 1][1] - baseY)
                dx[lastGPSIndex:i+2, 0] = ((dx[lastGPSIndex:i+2, 0] - baseX) * xScale) + baseX
                dx[lastGPSIndex:i+2, 1] = ((dx[lastGPSIndex:i+2, 1] - baseY) * yScale) + baseY
                currentGPSTime += 1
                lastGPSIndex = i + 1
        
        # Report Velocity for Verification
        velocityComponents = np.zeros([length, 2])
        for i in range(length):    
            velocityComponents[i, 0] = dx[i + 1, 0] - dx[i, 0]
            velocityComponents[i, 1] = dx[i + 1, 1] - dx[i, 1]
        v_total = np.sqrt(velocityComponents[:, 0] ** 2 + velocityComponents[:, 1] ** 2)
        if max(v_total) * fs > v * maxVelocityScale:
            print('Possible GPS Fit inaccuracy, maximum velocity of {0:.2f} is larger than the expected maximum of {1}'.format(max(v_total) * fs, v * maxVelocityScale))
    #calcDepth = np.array(calcDepth)
    #print(temp, ': ', sum(calcDepth ** 2) ** 0.5)
#%% Export Data
    csv['X Position'] = dx[:-1, 0]
    csv['Y Position'] = dx[:-1, 1]
    csv['Z Position'] = depth
    
    csv['Jerk_X'] = j[:,0]
    csv['Jerk_Y'] = j[:,1]
    csv['Jerk_Z'] = j[:,2]
    csv.to_csv('.'.join(filename.split('.')[0:-1]) + '_calculations.csv', index = False)
    gps.to_csv('.'.join(gpsname.split('.')[0:-1]) + '_calculations.csv', index = False)

#%% Main
if __name__ == "__main__":

    #%% Vincent's 3D Plot Testing
    calculation('../Data/gm14_279aprh.csv', '../Data/gm279alog.txt', '../Data/20141006_Barber_Focal_Follow_Gm_14_279a.xlsx')
    data = pd.read_csv('.'.join('../Data/gm14_279aprh.csv'.split('.')[0:-1]) + '_calculations.csv')
    gps = pd.read_excel('../Data/20141006_Barber_Focal_Follow_Gm_14_279a.xlsx')
    gps = gps[gps.FocalAvailability == 'Visual']
    latdata = gps['Location (Latitude)'].to_numpy()
    longdata = gps['Location (Longitude)'].to_numpy() 
    latdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in latdata]
    longdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in longdata]
    startlat = latdata[0]
    startlong = longdata[0]
    gps_xydata = np.array([xydistance(startlat, startlong, latdata[i], longdata[i]) for i in range(0, len(latdata))])
    gps_xydata[:,0] = gps_xydata[:,0] + np.sin(gps['Bearing(MAGNETIC!)'].to_numpy() * np.pi / 180) * gps['Range(m)'].to_numpy()
    gps_xydata[:,1] = gps_xydata[:,1] + np.cos(gps['Bearing(MAGNETIC!)'].to_numpy() * np.pi / 180) * gps['Range(m)'].to_numpy()
    gps['XDisplacement'] = gps_xydata[:,0]
    gps['YDisplacement'] = gps_xydata[:,1]
    gps = gps.dropna(subset=['XDisplacement', 'YDisplacement'])
    fig = go.Figure(data=[go.Scatter3d(
            x=data['X Position'], y=data['Y Position'], z=data['Z Position'],
        marker=dict(
            size=0.5,
            colorscale='Viridis',
        ),
        line=dict(
            color='darkblue',
            width=0.5
        )
    ), go.Scatter3d(
            x=gps['XDisplacement'], y=gps['YDisplacement'], z=np.zeros(len(gps['YDisplacement'])),
        mode = 'markers', 
        marker=dict(
            size=4,
            colorscale='Viridis',
        )
        )])
    
    fig.update_layout(
        width=800,
        height=700,
        scene=dict(
            xaxis_title="X Displacement (m)",
            yaxis_title="Y Displacement (m)",
            zaxis_title="Z Displacement (m)",
            camera=dict(
                up=dict(
                    x=0,
                    y=0,
                    z=1
                ),
                eye=dict(
                    x=0,
                    y=1.0707,
                    z=1,
                )
            ),
            aspectratio = dict( x=1, y=1, z=0.7 ),
            aspectmode = 'manual'
        )
    )
    plot(fig)

#%%