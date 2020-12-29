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

# * KWARGS (1) 
DATA_FILE_NAME_KWARG = "dataFileName"
DATA_FILE_PATH_KWARG = "dataFilePath"
LOG_FILE_NAME_KWARG = "logFileName"
LOG_FILE_PATH_KWARG = "logFilePath"
GPS_FILE_NAME_KWARG = "gpsFileName"
GPS_FILE_PATH_KWARG = "gpsFilePath"

ACTION_KWARG = "action"

GRAPHERS_DATA_AXIS_INDICES_KWARG = "DATA_AXIS_INDICES"
GRAPHERS_PRECALC_AXIS_INDICES_KWARG = "PRECALC_AXIS_INDICES"
GRAPHERS_DATA_FILE_KWARG = "DATA_FILE_DF"
GRAPHERS_PRECALC_FILE_KWARG = "PRECALC_FILE_DF"

# * FILES.JSON ENTRY KEYS 
ORIG_DATAFILE_PATH_KEY = DATA_FILE_NAME_KWARG
ORIG_DATAFILE_NAME_KEY = DATA_FILE_PATH_KWARG
GPS_NAME_KEY = GPS_FILE_NAME_KWARG
GPS_PATH_KEY = GPS_FILE_PATH_KWARG
LOG_NAME_KEY = LOG_FILE_NAME_KWARG
LOG_PATH_KEY = LOG_FILE_PATH_KWARG
CSV_NAME_KEY = "CSVFileName"
CSV_PATH_KEY = "CSVFilePath"
PRECALC_KEY = "PrecalculationsPath"
FILE_SIZE_KEY = "size"
FILE_MODIFY_DATE_KEY = "modified"

# graphs2D / graphs3D : {HTMLFileName : HTMLFilePath}
GRAPH_2D_KEY 'graphs2D'
GRAPH_3D_KEY = 'graphs3D'

# MAIN PATH KEYS -- excludes ORIG_PATH_KEY
PATH_KEYS = [CSV_PATH_KEY, GPS_PATH_KEY, LOG_PATH_KEY, PRECALC_KEY]
# (path_key in files.json, file_path storage in user_files) format 
UPLOAD_MODULE_SAVE_FILE_PATH_KEYS = [(GPS_PATH_KEY, GPS_FILE_DIR_PATH), (LOG_PATH_KEY, LOG_FILE_DIR_PATH)]

# * OTHER 
# USED IN UPDATES.PY TO SET FILE TIME 
FILE_TIME_FORMAT = "%m/%d/%Y %I:%M:%S %p"
GRAPH_TYPES = ['graphs2D', 'graphs3D']