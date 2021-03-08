import os 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILES_DIR = os.path.join(BASE_DIR, 'files')
EXPORT_HTML_DIR = os.path.join(FILES_DIR, 'export_html')
EXPORT_VIDEO_DIR = os.path.join(FILES_DIR, 'export_video')
TEST_DIR = os.path.join(BASE_DIR, 'test')