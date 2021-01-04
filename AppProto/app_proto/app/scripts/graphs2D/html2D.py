"""
Generating 2D Graphs and Precalculations
** INDICES (32 ~ 232) ARE HARD CODED TO DEAL WITH NO VALUES ** 
"""
from typing import List, Tuple
from scipy.io import loadmat 
from scipy.signal import decimate as dc 
from pyquaternion import Quaternion
from plotly import graph_objects as go 
from plotly import express as px
from plotly.offline import plot 
from datetime import datetime, timedelta
from multiprocessing import Process 
import numpy as np 
import pandas as pd
import csv
import sys 
import os 
import json
import matplotlib.pyplot as plt 
import xml.dom.minidom
import re 

from .graphers2D import * 
import helper_json

from settings import BASE_DIR
GRAPHS_DIR = os.path.join(BASE_DIR, 'user_graphs')
PRECALCS_DIR = os.path.join(GRAPHS_DIR, 'precalcs')
GRAPHS_2D_DIR = os.path.join(GRAPHS_DIR, '2D')
GRAPHS_3D_DIR = os.path.join(GRAPHS_DIR, '3D')
SCRIPTS_FILES = os.path.join(BASE_DIR, 'scripts_files')
file_info = os.path.join(SCRIPTS_FILES, 'files.json')

sys.path.append(BASE_DIR)

def create_graph(creator_input: "variable tuple", func: "function", names: List[str], file_: str) -> None:
    """
    Wrapper for the graph functions, writes each to html to reduce code 
    - len(names) == len(List[] return from func)
    """
    graphs = func(*creator_input) 
    for name, graph in zip(names, graphs):
        path_ = os.path.join(GRAPHS_2D_DIR, file_, name)
        graph.write_html(path_)

def save_existing_graphs(file_: str) -> List[str]:
    """
    Hack-y way of doing it... instead of waiting on each process return value
    Just save the existing graphs 
    """
    try: 
        unsaved_graphs, saved_graphs = [], {}

        path_ = os.path.join(GRAPHS_2D_DIR, file_)

        for creator_type in CREATORS: 
            for creator in CREATORS[creator_type]:
                graph_names = list(creator[1:])
                for graph in graph_names: 
                    check_path = os.path.join(path_, graph)

                    if not os.path.isfile(check_path):
                        unsaved_graphs.append(graph)
                        saved_graphs[graph] = ""
                    else:
                        saved_graphs[graph] = check_path
                
        info = helper_json.read(file_info)
        info[file_]['graphs2D'] = saved_graphs
        helper_json.create(file_info, info) 

        return unsaved_graphs
    except Exception as e:
        print(e)

def exist_calculations(file_: str, calc_file: str) -> bool: 
    """
    Checks if pre-calculations already exist 
    """
    try: 
        info = helper_json.read(file_info)
        if not 'extra' in info[file_]: 
            return False 
        return calc_file in info[file_]['extra']
    except Exception as e: 
        print(e)
        return False

def get_calculations(file_: str, calc_file: str): 
    """
    Returns pre-calculations file path 
    """
    try: 
        if not exist_calculations(file_, calc_file): return None 
        info = helper_json.read(file_info)
        return info[file_]['extra'][calc_file]
    except Exception as e: 
        return None 

def save_calculations(file_: str, calc_file: str, data: "dataframe") -> bool:
    """
    False IF fail, True IF success
    """
    try: 
        info = helper_json.read(file_info)
        if not os.path.isdir(PRECALCS_DIR): 
            os.mkdir(PRECALCS_DIR)
        calc_file_path = os.path.join(PRECALCS_DIR, calc_file)
        data.to_csv(calc_file_path)
        if not 'extra' in info[file_]:
            info[file_]['extra'] = {} 
        info[file_]['extra'][calc_file] = calc_file_path
        helper_json.create(file_info, info)

        return True 
    except Exception as e: 
        print(e) 
        return False 

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
def logProcessStarttime(logFilePath: str):
    ext = logFilePath.split('.')[-1]
    if ext == 'txt':
        log = open(logFilePath, 'r').read()
        intTime = int(re.findall('[0-9a-f]{8}', log)[0], 16)
        originTime = datetime(1900, 1, 1, 0, 0, 0)
        deltaTime = timedelta(seconds = intTime)
        startTime = originTime + deltaTime + timedelta(hours = 4) #HARDCODED FROM UTC-4 TO UTC
    elif ext == 'xml':
        DOMTree = xml.dom.minidom.parse(logFilePath)
        collection = DOMTree.documentElement
        collection.getElementsByTagName("EVENT")
        dateStr = collection.getElementsByTagName("EVENT")[0].getAttribute('TIME')
        startTime = datetime.strptime(dateStr, '%Y,%m,%d,%H,%M,%S')
    else:

        # TODO: get this msg into the app 
        # print('Log filetype error: only .xml and .txt expected')
        return 0
    return startTime

def getExtraFilePaths(file_: str):
    info = helper_json.read(file_info)b  
    fileInfo = info[file_]
    
    #TODO: error checking
    logFilePath = fileInfo['logFilePath']
    gpsFilePath = fileInfo['gpsFilePath']

    return (logFilePath, gpsFilePath)

# TODO: get the logFilePath and gpsFilePath within pre_calculations from json file 
    # if logFilePath does not exist, then throw error -- might do to move this error checking to when file is first uploaded
    # if gpsFilePath does not exist, then just leave as ''

def pre_calculations(file_: str, file_path: str, calc_file: str):
    """
    PRECALCULATE REUSED DATA 
    """
    if exist_calculations(file_, calc_file): return 

    logFilePath, gpsFilePath = getExtraFilePaths(file_)

    csv = pd.read_csv(file_path)
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
    startTime = logProcessStarttime(logFilePath)
        
    #%% GPS File Not Included, Calculate Manually
    if(gpsFilePath == ''):
        for i in range(length):
            rollq = Quaternion(axis=[1, 0, 0], angle=roll[i])
            pitchq = Quaternion(axis=[0, 1, 0], angle=pitch[i])
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
    if(gpsFilePath != ''):
        # Calculate and Reformat GPS Data
        gps = pd.read_excel(gpsFilePath)
        dates = [datetime.strptime(i, '%Y-%m-%dT%H:%M:%S') for i in gps['Date Created'].to_numpy()]
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



        # if max(v_total) * fs > v * maxVelocityScale:


        #     # TODO: get this message into the app 
        #     print('Possible GPS Fit inaccuracy, maximum velocity of {0:.2f} is larger than the expected maximum of {1}'.format(max(v_total) * fs, v * maxVelocityScale))
        #calcDepth = np.array(calcDepth)
        #print(temp, ': ', sum(calcDepth ** 2) ** 0.5)
    #%% Export Data
    csv['X Position'] = dx[:-1, 0]
    csv['Y Position'] = dx[:-1, 1]
    csv['Z Position'] = depth
    
    csv['Jerk_X'] = j[:,0]
    csv['Jerk_Y'] = j[:,1]
    csv['Jerk_Z'] = j[:,2]

    # csv.to_csv('.'.join(filename.split('.')[0:-1]) + '_calculations.csv', index = False)


    return save_calculations(file_, calc_file, csv)

def main(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    Main handler 
    """
    try: 
        calc_file = f"{''.join(file_.split('.')[:-1])}_precalc.csv"
        pre_calculations(file_, file_path, calc_file)
        calc_file_path = get_calculations(file_, calc_file)

        df = pd.read_csv(file_path)
        precalc_df = pd.read_csv(calc_file_path)

        # arbitrary for this set of graphs -- TAKE A LOOK AT THIS 
        startIndex = 32
        endIndex = 232

        xAxis = list(range(startIndex, endIndex)) 
        indices = (startIndex, endIndex)

        all_processes = [] 

        total_graphs = 0 

        creator_inputs = {
            'STANDARD': [df, xAxis, indices],
            'PRECALC_DF': [precalc_df, xAxis, indices],
            'STANDARD_ONLY_DF': [df]
        }

        # multiprocessing 
        for creator_type in CREATORS: 
            creator_input = creator_inputs[creator_type]
            for creator in CREATORS[creator_type]:
                func = creator[0]
                names = list(creator[1:])
                total_graphs += len(names)
                p = Process(target=create_graph, args=(creator_input, func, names, file_))
                all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 
        
        unsaved_graphs = save_existing_graphs(file_)

        if total_graphs == len(unsaved_graphs):
            return (False, [])
        
        return (True, unsaved_graphs)
    except Exception as e:


        # #TODO: remove this print
        print(repr(e))


        return (False, [])

def test(file_: str, file_path: str) -> Tuple[bool, List[str]]: 
    """
    TEST of MAIN handler 
    """
    try: 
        df = pd.read_csv(file_path)

        # arbitrary for this set of graphs
        startIndex = 32
        endIndex = 232

        xAxis = list(range(startIndex, endIndex))
        indices = (startIndex, endIndex)


        all_processes = [] 

        # multiprocessing
        for creator in CREATORS: # 'CREATORS' MUST conform to create_graph params/args 
            func = creator[0]
            names = list(creator[1:])
            p = Process(target=create_graph, args=(df, xAxis, indices, func, names, file_))
            all_processes.append(p)
        
        for p in all_processes:
            p.start() 

        for p in all_processes: # have the main code wait for execution to then check for files that exist
            p.join() 

        unsaved_graphs = [] 

        return (True, unsaved_graphs)
    except Exception as e:
        return (False, [])


if __name__ == "__main__":
    # this is only testing -- this module is only really called via the 'main()' function 
    # print(main('mn17_005aprh25.mat.csv', 'mn17_005aprh25.mat.csv'))
    # sys.stdout.flush()

    print('hi')