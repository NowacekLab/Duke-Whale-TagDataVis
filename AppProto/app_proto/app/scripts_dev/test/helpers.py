import os  
from test.constants import EXPORT_HTML_DIR, EXPORT_VIDEO_DIR

def get_files_in_dir(dirPath: str):
  files = []
  try:
    for item in os.listdir(dirPath):
      if os.path.isfile(os.path.join(dirPath, item)):
        files.append(os.path.join(dirPath, item))
        
    return files 
  except:
    return files 

HTML_EXPORT_TEST_FILES = get_files_in_dir(EXPORT_HTML_DIR)
VIDEO_EXPORT_TEST_FILES = get_files_in_dir(EXPORT_VIDEO_DIR)