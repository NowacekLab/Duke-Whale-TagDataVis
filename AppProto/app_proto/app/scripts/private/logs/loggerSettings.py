import os 
import logging 

import settings 


BASE_DIR = settings.BASE_DIR_PATH
PRIVATE_DIR = os.path.join(BASE_DIR, 'private')
LOGS_DIR = os.path.join(PRIVATE_DIR, 'logs')

# Must be same length 
LOG_FILE_TYPES = ['actions', 'errors']
LOG_FILE_LEVELS = [logging.INFO, logging.ERROR]

LOG_FORMAT = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

class customLogFilter(logging.Filter): 
    def __init__(self, level):
        self._level = level 
    
    def filter(self, record):
        return record.levelno <= self._level 