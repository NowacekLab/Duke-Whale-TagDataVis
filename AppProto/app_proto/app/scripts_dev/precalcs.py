from pyquaternion import Quaternion 
from datetime import datetime, timedelta 
import os 
import numpy as np 
import pandas as pd 
import xml.dom.minidom 
import re 

from typing import Tuple, Callable, Any
from private.helpers import keysHelper, pathsHelper, kwargsHelper, pandasHelper
from private.logs import logDecorator
from . import reset 

MODULE_NAME = "precalcs"
genericLog = logDecorator.genericLog(MODULE_NAME)


@genericLog
def _haversine(lat1, long1, lat2, long2):
    '''
    ---NOTE---: Assumes N and W as positive cardinal directions
    '''
    lat1 = lat1 * np.pi / 180
    lat2 = lat2 * np.pi / 180
    long1 = long1 * np.pi / 180
    long2 = long2 * np.pi / 180
    dlat = lat2 - lat1
    dlong = long2 - long1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlong / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return c * 6371000

@genericLog
def _inverseHaversine(lat1, long1, d, tc): 
    '''[Calculate Inverse Haversine - dLat/dLong given a distance and angle]
    Sourced from: http://www.edwilliams.org/avform.htm#LL
    ---NOTE---: Assumes N and W as positive cardinal directions
    Parameters
    ----------
    lat1 : float
        Initial Latitude (degrees)
    long1 : float
        Initial Longitude (degrees)
    d : float
        Distance (meters)
    tc : float
        Heading Angle (N is 0 rad) (radians)

    Returns
    -------
    (finalLat, finalLong) : Tuple[float]
        Resultant lat/long (degrees)
    '''
    d = d / 6378100
    lat1 = lat1 * np.pi / 180
    long1 = long1 * np.pi / 180
    lat = np.arcsin(np.sin(lat1)*np.cos(d)+np.cos(lat1)*np.sin(d)*np.cos(tc))
    dlon=np.arctan2(np.sin(tc)*np.sin(d)*np.cos(lat1),np.cos(d)-np.sin(lat1)*np.sin(lat))
    lon = (long1 - dlon + np.pi) % (2 * np.pi) - np.pi
    return (lat * 180 / np.pi, lon * 180 / np.pi)
    

#Calculate X-Y Displacement Between Two Lat. Long. Pts. (VW)
@genericLog
def _xydistance(lat1, long1, lat2, long2):
    x1 = _haversine(lat1, long1, lat1, long2)
    if(long2 > long1): #Direcional Correction Factors to convert 
        x1 = -x1
    y1 = _haversine(lat1, long1, lat2, long1)
    if(lat1 > lat2):
        y1 = -y1
    x2 = _haversine(lat2, long1, lat2, long2)
    if(long2 > long1):
        x2 = -x2
    y2 = _haversine(lat1, long2, lat2, long2)
    if(lat1 > lat2):
        y2 = -y2
    return (x1+x2)/2, (y1+y2)/2

dateTime = Any 
@genericLog
def _xmlLogFileProcessor(logFilePath: str) -> datetime: 
    DOMTree = xml.dom.minidom.parse(logFilePath)
    collection = DOMTree.documentElement
    collection.getElementsByTagName("EVENT")
    dateStr = collection.getElementsByTagName("EVENT")[0].getAttribute('TIME')
    startTime = datetime.strptime(dateStr, '%Y,%m,%d,%H,%M,%S')
    return startTime 

@genericLog
def _txtLogFileProcessor(logFilePath: str) -> datetime: 
    
    with open(logFilePath, 'r') as logFile: 
        log = logFile.read()
    
    intTime = int(re.findall('[0-9a-f]{8}', log)[0], 16)
    originTime = datetime(1900, 1, 1, 0, 0, 0)
    deltaTime = timedelta(seconds = intTime)
    startTime = originTime + deltaTime + timedelta(hours = 4) #HARDCODED FROM UTC-4 TO UTC
    return startTime 

@genericLog
def _getLogProcessor(logFilePath: str) -> Callable: 
    ext = logFilePath.split('.')[-1]
    if ext == "txt":
        return _txtLogFileProcessor
    elif ext == "xml": 
        return _xmlLogFileProcessor
    raise Exception(f"Log file must be .xml or .txt. Given file has extension: {ext}")

@genericLog
def _logProcessStartTime(logFilePath: str) -> datetime:
    """[Calculating tag start time from uploaded log file]

    Args:
        logFilePath (str): [path to uploaded log file]

    Returns:
        dateTime: [datetime object]
    """
    logProcessor = _getLogProcessor(logFilePath)
    startTime = logProcessor(logFilePath)
    return startTime 

@genericLog
def _getGPSFileTup(filesInfo: dict) -> Tuple[str]:
    
    GPS_PATH_KEY = keysHelper.getGPSPathKey()
    GPS_NAME_KEY = keysHelper.getGPSNameKey()
    
    gpsFilePath = filesInfo[GPS_PATH_KEY]
    gpsNameKey = filesInfo[GPS_NAME_KEY]
    
    return (gpsFilePath, gpsNameKey)
    
@genericLog
def _getLogFileTup(filesInfo: dict) -> Tuple[str]: 
    
    LOG_PATH_KEY = keysHelper.getLogPathKey()
    LOG_NAME_KEY = keysHelper.getLogNameKey() 
    
    logFilePath = filesInfo[LOG_PATH_KEY]
    logFileName = filesInfo[LOG_NAME_KEY]
    
    return (logFilePath, logFileName)
    
@genericLog
def _getDataFileTup(filesInfo: dict) -> Tuple[str]:    
    
    CSV_PATH_KEY = keysHelper.getCSVPathKey()
    CSV_NAME_KEY = keysHelper.getCSVNameKey()
    
    CSVDataFilePath = filesInfo[CSV_PATH_KEY]
    CSVDataFileName = filesInfo[CSV_NAME_KEY]
    
    return (CSVDataFilePath, CSVDataFileName)

@genericLog 
def _getStartLatLong(filesInfo: dict) -> Tuple[float]:
    
    START_LAT_KEY = keysHelper.getStartLatKey()
    START_LONG_KEY = keysHelper.getStartLongKey()
    
    startLat = float(filesInfo[START_LAT_KEY])
    startLong = float(filesInfo[START_LONG_KEY])
    
    return (startLat, startLong)

@genericLog 
def _convertToPreCalcFileName(dataFileName: str) -> str: 
    dataFileNameParts = dataFileName.split(".")
    dataFileNameParts[-1] = "_precalc.csv"
    preCalcFileName = ''.join(dataFileNameParts)
    return preCalcFileName

PandasDataFrame = Any 
@genericLog
def _savePreCalcDataFrame(df: PandasDataFrame, dataFileName: str) -> str: 
    PRECALCS_DIR_PATH = pathsHelper.getPreCalcsDirPath()
    
    preCalcFileName = _convertToPreCalcFileName(dataFileName)
    
    preCalcDataPath = os.path.join(PRECALCS_DIR_PATH, preCalcFileName)
    pandasHelper.savePandasDataFrame(df, preCalcDataPath)
    return preCalcDataPath


@genericLog
#Reminder, requires startLat and startLong with convention of N-W as positive (rather than N-E)
def _preCalc(dataFilePath: str, logFilePath: str, gpsFilePath: str, startLatitude: float, startLongitude: float) -> PandasDataFrame:    
    csv = pd.read_csv(dataFilePath)
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
    latArray = np.zeros(length + 1)
    longArray = np.zeros(length + 1)
    latArray[0] = startLatitude
    longArray[0] = startLongitude
    
    startTime = _logProcessStartTime(logFilePath)
    time = np.array([startTime + timedelta(seconds = i * ts) for i in range(length)])
    
    #%% GPS File Not Included, Calculate Manually
    if (gpsFilePath == ''):
        for i in range(length):
            rollq = Quaternion(axis=[0, 1, 0], angle=roll[i])
            pitchq = Quaternion(axis=[1, 0, 0], angle=pitch[i])
            yawq = Quaternion(axis=[0, 0, 1], angle=yaw[i])
            rotateq = (yawq * pitchq * rollq)
            direc = rotateq.rotate(forward_vec)
            project_vec = np.array([direc[0], direc[1], 0])
            angle = np.arccos(np.dot(direc, project_vec) / (np.linalg.norm(project_vec)))
            dv = v * np.cos(angle)
            # print(i)
            #Calculate new displacement for the current step
            dx[i + 1] = [(dv * np.sin(yaw[i])) * ts + dx[i][0], (dv * np.cos(yaw[i])) * ts + dx[i][1]] #CHECK THIS STEPPPPPPPP
            #fill in jerk for each step, skip first step & leave it as 0
            if (i!=0):
                j[i]=[(accel_x[i]-accel_x[i-1])/fs,(accel_y[i]-accel_y[i-1])/fs,(accel_z[i]-accel_z[i-1])/fs]

    #%% GPS File Included, Fit to GPS Data
    if (gpsFilePath != ''):
        # Calculate and Reformat GPS Data
        gps = pd.read_excel(gpsFilePath, engine='openpyxl')
        dates = [datetime.strptime(i, '%Y-%m-%dT%H:%M:%S') for i in gps['Date Created'].to_numpy()]
        timepass = [(i - startTime).seconds for i in dates]
        gps['Time'] = timepass
        try:
            gps = gps[gps.FocalAvailability == 'Visual']
        except AttributeError:
            pass
        try:
            gps = gps[gps['Focal Availability'] == 'Visual']
        except KeyError:
            pass
        latdata = gps['Location (Latitude)'].to_numpy()
        longdata = gps['Location (Longitude)'].to_numpy() 
        latdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in latdata]
        longdata = [float(re.findall("[+-]?\d+\.\d+", i)[0]) for i in longdata]
        startlat = latArray[0]
        startlong = longArray[0]
        gps_xydata = np.array([_xydistance(startlat, startlong, latdata[i], longdata[i]) for i in range(0, len(latdata))])
        try:
            boatBearing = gps['Bearing(MAGNETIC!)']
        except KeyError:
            pass
        try:
            boatBearing = gps['Bearing']
        except KeyError:
            pass
        try:
            boatDistance = gps['Range']
        except KeyError:
            pass
        try:
            boatDistance = gps['Range(m)']
        except KeyError:
            pass
        gps_xydata[:,0] = gps_xydata[:,0] + np.sin(boatBearing.to_numpy() * np.pi / 180) * boatDistance.to_numpy()
        gps_xydata[:,1] = gps_xydata[:,1] + np.cos(boatBearing.to_numpy() * np.pi / 180) * boatDistance.to_numpy()
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
            #Calculate new displacement for the current step
            dx[i + 1] = [(dv * np.sin(yaw[i])) * ts + dx[i][0], (dv * np.cos(yaw[i])) * ts + dx[i][1]] #CHECK THIS STEP


            
            
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
            
        # Report Velocity for Verification and Calc. Long/Lat
        velocityComponents = np.zeros([length, 2])
        for i in range(length):    
            #Calculate Long/Lat
            d = np.sqrt(dx[i+1, 0] ** 2 + dx[i+1, 1] ** 2) #(meters)
            tc = np.arctan2(dx[i+1, 1], dx[i+1, 0])
            latArray[i + 1], longArray[i + 1] = _inverseHaversine(startlat, startlong, d, tc)
            velocityComponents[i, 0] = dx[i + 1, 0] - dx[i, 0]
            velocityComponents[i, 1] = dx[i + 1, 1] - dx[i, 1]
        v_total = np.sqrt(velocityComponents[:, 0] ** 2 + velocityComponents[:, 1] ** 2)
        
        csv['Latitude'] = latArray[:-1]
        csv['Longitude'] = longArray[:-1]
        csv['Time'] = time
        
        if max(v_total) * fs > v * maxVelocityScale:

            # TODO: get this message into the app 
            # print('Possible GPS Fit inaccuracy, maximum velocity of {0:.2f} is larger than the expected maximum of {1}'.format(max(v_total) * fs, v * maxVelocityScale))
            calcDepth = np.array(calcDepth)
            # print(temp, ': ', sum(calcDepth ** 2) ** 0.5)
        
        
    #%% Export Data
    csv['X Position'] = dx[:-1, 0]
    csv['Y Position'] = dx[:-1, 1]
    csv['Z Position'] = depth
    
    csv['Jerk_X'] = j[:,0]
    csv['Jerk_Y'] = j[:,1]
    csv['Jerk_Z'] = j[:,2]
    
    return csv 

@genericLog
def _preCalcAndSave(filesInfo: dict):
    dataFilePath, dataFileName = _getDataFileTup(filesInfo)
    logFilePath, logFileName = _getLogFileTup(filesInfo)
    gpsFilePath, gpsFileName = _getGPSFileTup(filesInfo)
    startLat, startLong = _getStartLatLong(filesInfo)
    dataFrame = _preCalc(dataFilePath, logFilePath, gpsFilePath, startLat, startLong)
    preCalcDataPath = _savePreCalcDataFrame(dataFrame, dataFileName)
    return preCalcDataPath
    
@genericLog
def handlePreCalculate(filesInfo: dict) -> dict:
    preCalcDataPath = _preCalcAndSave(filesInfo)
    
    PRECALC_KEY = keysHelper.getPreCalcKey()
    filesInfoCopy = filesInfo.copy()
    filesInfoCopy[PRECALC_KEY] = preCalcDataPath
    
    return filesInfoCopy 