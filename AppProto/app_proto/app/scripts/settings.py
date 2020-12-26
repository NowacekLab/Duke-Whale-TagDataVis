    """[Holds global settings vars.]
    
    """
import os 

# for package:
# BASE_DIR_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# for dev:
BASE_DIR_PATH = os.path.dirname(os.path.abspath(__file__))

FILE_DIR_PATH = os.path.join(BASE_DIR_PATH, 'user_files')

SCRIPTS_FILES_path = os.path.join(BASE_DIR_PATH, 'scripts_files')
FILE_INFO = os.path.join(SCRIPTS_FILES_PATH, 'files.json')

GRAPHS_DIR_PATH = os.path.join(BASE_DIR_PATH, 'user_graphs')
GRAPHS_2D_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, '2D')
GRAPHS_3D_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, '3D')
ALL_GRAPHS_DIR_PATHS = [GRAPHS_2D_DIR_PATH, GRAPHS_3D_DIR_PATH]
GRAPH_TYPES = ['graphs2D', 'graphs3D']

PRECALS_DIR_PATH = os.path.join(GRAPHS_DIR_PATH, 'precalcs')

#KWARGS
    #- kwargs for modules
    #- standard kwargs used in communication between JS and Python
DATA_FILE_NAME_KWARG = "dataFileName"
DATA_FILE_PATH_KWARG = "dataFilePath"
LOG_FILE_NAME_KWARG = "logFileName"
LOG_FILE_PATH_KWARG = "logFilePath"
GPS_FILE_NAME_KWARG = "gpsFileName"
GPS_FILE_PATH_KWARG = "gpsFilePath"

ACTION_KWARG = "action"

ACTION_MODULE_UPLOAD_KWARGS = [ACTION_KWARG,
                                DATA_FILE_NAME_KWARG, DATA_FILE_PATH_KWARG,
                                LOG_FILE_NAME_KWARG, LOG_FILE_PATH_KWARG,
                                GPS_FILE_NAME_KWARG, GPS_FILE_PATH_KWARG]
ACTION_MODULE_REPROCESS_KWARGS = [ACTION_KWARG,
                                    DATA_FILE_NAME_KWARG, DATA_FILE_PATH_KWARG]
ACTION_MODULE_EDIT_KWARGS = [ACTION_KWARG,
                    DATA_FILE_NAME_KWARG, DATA_FILE_PATH_KWARG]
ACTION_MODULE_SAVE_KWARGS = [ACTION_KWARG,
                    DATA_FILE_KWARG, DATA_FILE_PATH_KWARG]

# * files.json entry keys 
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

# * used in updates.py to set FILE_MODIFY_DATE_KEY value 
FILE_TIME_FORMAT = "%m/%d/%Y %I:%M:%S %p"

# * MAIN PATH KEYS -- excludes ORIG_PATH_KEY
PATH_KEYS = [CSV_PATH_KEY, GPS_PATH_KEY, LOG_PATH_KEY, PRECALC_KEY]

# * upload.py KWARGs to loop and add to file.json dict 
UPLOAD_MODULE_LOOPABLE_KWARGS = [DATA_FILE_NAME_KWARG, DATA_FILE_PATH_KWARG,
                                LOG_FILE_NAME_KWARG, LOG_FILE_PATH_KWARG,
                                GPS_FILE_NAME_KWARG, GPS_FILE_PATH_KWARG]