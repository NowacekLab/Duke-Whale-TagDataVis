"""[Holds global settings vars.]

NOTE: rarely, if at all, accessed directly from here except by helpers 

"""
    
import os 

# * DIRECTORIES 
# for package:
# BASE_DIR_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# for dev:
BASE_DIR_PATH = os.path.dirname(os.path.abspath(__file__))

FILES_DIR_PATH = os.path.join(BASE_DIR_PATH, 'files')

# user_files
USER_FILES_DIR_PATH = os.path.join(FILES_DIR_PATH, 'user_files')
DATA_FILE_DIR_PATH = os.path.join(USER_FILES_DIR_PATH, 'dataFiles')
GPS_FILE_DIR_PATH = os.path.join(USER_FILES_DIR_PATH, 'gpsFiles')
LOG_FILE_DIR_PATH = os.path.join(USER_FILES_DIR_PATH, 'logFiles')

# scripts_files
SCRIPTS_FILES_PATH = os.path.join(FILES_DIR_PATH, 'scripts_files')
FILE_INFO_PATH = os.path.join(SCRIPTS_FILES_PATH, 'files.json')

# user graphs 
GRAPHS_DIR_PATH = os.path.join(USER_FILES_DIR_PATH, 'user_graphs')
GRAPHS_2D_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, '2D')
GRAPHS_3D_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, '3D')
PRECALCS_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, 'precalcs')
ALL_GRAPHS_DIR_PATHS = [GRAPHS_2D_DIR_PATH, GRAPHS_3D_DIR_PATH]

# ! for main.py path creator 
REQUIRED_DIRS = [FILES_DIR_PATH, USER_FILES_DIR_PATH, 
                DATA_FILE_DIR_PATH, GPS_FILE_DIR_PATH, LOG_FILE_DIR_PATH,
                SCRIPTS_FILES_PATH, 
                GRAPHS_DIR_PATH, GRAPHS_2D_DIR_PATH, GRAPHS_3D_DIR_PATH,
                PRECALCS_DIR_PATH]
REQUIRED_FILES = [FILE_INFO_PATH]

# * KWARGS (1) 

# for main.py 
MODULE_NAME_KWARG = 'moduleName'

# for actions.py 
ACTION_KWARG = "action"

# for actions.py / uploading 
DATA_FILE_NAME_KWARG = "dataFileName"
DATA_FILE_PATH_KWARG = "dataFilePath"
LOG_FILE_NAME_KWARG = "logFileName"
LOG_FILE_PATH_KWARG = "logFilePath"
GPS_FILE_NAME_KWARG = "gpsFileName"
GPS_FILE_PATH_KWARG = "gpsFilePath"
START_LAT_KWARG = 'startLat'
START_LONG_KWARG = 'startLong'

# for graphers 
GRAPHERS_DATA_AXIS_INDICES_KWARG = "DATA_AXIS_INDICES"
GRAPHERS_PRECALC_AXIS_INDICES_KWARG = "PRECALC_AXIS_INDICES"
GRAPHERS_DATA_FILE_KWARG = "DATA_FILE_DF"
GRAPHERS_PRECALC_FILE_KWARG = "PRECALC_FILE_DF"

# for actions.py / request 
REQUEST_KWARG = "request"

# * FILES.JSON ENTRY KEYS 
# for main.py module name
MODULE_NAME_KEY = MODULE_NAME_KWARG 
# for actions.py module 
ACTION_KEY = ACTION_KWARG 

# for files.json / uploading 
ORIG_DATAFILE_NAME_KEY = DATA_FILE_NAME_KWARG
ORIG_DATAFILE_PATH_KEY = DATA_FILE_PATH_KWARG
GPS_NAME_KEY = GPS_FILE_NAME_KWARG
GPS_PATH_KEY = GPS_FILE_PATH_KWARG
LOG_NAME_KEY = LOG_FILE_NAME_KWARG
LOG_PATH_KEY = LOG_FILE_PATH_KWARG
CSV_NAME_KEY = "CSVFileName"
CSV_PATH_KEY = "CSVFilePath"
PRECALC_KEY = "PrecalculationsPath"
GRAPH_2D_KEY = 'graphs2D'
GRAPH_3D_KEY = 'graphs3D'
START_LAT = START_LAT_KWARG
START_LONG = START_LONG_KWARG
FILE_SIZE_KEY = "size"
FILE_MODIFY_DATE_KEY = "modified"

ALL_FILE_INFO_KEYS = [ORIG_DATAFILE_PATH_KEY, ORIG_DATAFILE_NAME_KEY,
                        GPS_NAME_KEY, GPS_PATH_KEY,
                        LOG_NAME_KEY, LOG_PATH_KEY,
                        CSV_NAME_KEY, CSV_PATH_KEY,
                        PRECALC_KEY,
                        GRAPH_2D_KEY, GRAPH_3D_KEY]

# MAIN PATH KEYS -- excludes ORIG_PATH_KEY
PATH_KEYS = [CSV_PATH_KEY, GPS_PATH_KEY, LOG_PATH_KEY, PRECALC_KEY]
# (path_key in files.json, file_path storage in user_files) format 
UPLOAD_MODULE_SAVE_FILE_PATH_KEYS = [(GPS_PATH_KEY, GPS_FILE_DIR_PATH), (LOG_PATH_KEY, LOG_FILE_DIR_PATH)]

# * OTHER 
# USED IN UPDATES.PY TO SET FILE TIME 
FILE_TIME_FORMAT = "%m/%d/%Y %I:%M:%S %p"
GRAPH_TYPES = ['graphs2D', 'graphs3D']