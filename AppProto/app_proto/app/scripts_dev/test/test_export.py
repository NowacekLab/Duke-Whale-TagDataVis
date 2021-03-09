import export_generic 
import export_html 
import export_video 
import os 
import shutil 
import unittest 
from test.constants import BASE_DIR, FILES_DIR, TEST_DIR
from test.helpers import HTML_EXPORT_TEST_FILES, VIDEO_EXPORT_TEST_FILES

def do_file_paths_exist(file_paths):
    return all(os.path.isfile(file_path) for file_path in file_paths)

class TestExportGeneric(unittest.TestCase):
    
    TEST_DIRECTORY = TEST_DIR 
    TEST_FILE_NAMES = ['foo', 'bar', 'zee']
    
    def setUp(self):
        os.mkdir(self.TEST_DIRECTORY)
        
    def tearDown(self):
        shutil.rmtree(self.TEST_DIRECTORY) 
    
    def test_export_single_generic(self):
        file_paths = [os.path.join(self.TEST_DIRECTORY, file_name) for file_name in self.TEST_FILE_NAMES]
        export_generic.export_single_generic(self.sample_exporter_one_arg, file_paths)
        self.assertTrue(do_file_paths_exist(file_paths))
        
    def sample_exporter_one_arg(self, file_dirs):
        for file_dir in file_dirs:
            self.create_new_file(file_dir)
        return 

    def create_new_file(self, file_path):
        with open(file_path, 'w') as f:
            pass 
        
    def test_export_iterate_generic(self):
        export_generic.export_iterate_generic(self.sample_exporter_two_args, self.TEST_FILE_NAMES, self.TEST_DIRECTORY)
        file_paths = [os.path.join(self.TEST_DIRECTORY, file_name) for file_name in self.TEST_FILE_NAMES]
        self.assertTrue(do_file_paths_exist(file_paths))
        
    def sample_exporter_two_args(self, file_name, target_dir):
        new_path = os.path.join(target_dir, file_name)
        self.create_new_file(new_path)
        return 
        
class TestExportHTML(unittest.TestCase):
    
    TEST_DIRECTORY = TEST_DIR 
    TEST_FILE_PATHS = HTML_EXPORT_TEST_FILES
    
    def setUp(self):
        os.mkdir(self.TEST_DIRECTORY)

    def tearDown(self):
        shutil.rmtree(self.TEST_DIRECTORY)
    
    def test_export_html_single_one(self):
        export_html.export_html_single(self.TEST_FILE_PATHS[0], self.TEST_DIRECTORY)
        new_file_paths = [os.path.join(self.TEST_DIRECTORY, self.TEST_FILE_PATHS[0])] 
        success = do_file_paths_exist(new_file_paths)
        self.assertTrue(success)
    
    def test_export_html_multiple(self):
        export_html.export_html_multiple(self.TEST_FILE_PATHS, self.TEST_DIRECTORY)
        new_file_paths = [os.path.join(self.TEST_DIRECTORY, file_name) for file_name in self.file_names_from_paths(self.TEST_FILE_PATHS)]
        success = do_file_paths_exist(new_file_paths)
        self.assertTrue(success)

    def file_names_from_paths(self, file_paths):
        return [os.path.basename(file_path) for file_path in file_paths]

# class TestExportVideo(unittest.TestCase):
    
#     TEST_DIRECTORY = TEST_DIR 
#     TEST_FILE_PATHS = VIDEO_EXPORT_TEST_FILES
    
#     def setUp(self):
#         os.mkdir(self.TEST_DIRECTORY)
        
#     def tearDown(self):
#         print("REMOVE test/test")
        
#         # shutil.rmtree(self.TEST_DIRECTORY)
    
#     def test_export_video_single_one(self):
#         export_video.export_video_single(self.TEST_FILE_PATHS[0], self.TEST_DIRECTORY)
#         new_file_paths = [os.path.join(self.TEST_DIRECTORY, self.TEST_FILE_PATHS[0])]
#         success = do_file_paths_exist(new_file_paths)
#         self.assertTrue(success)

if __name__ == "__main__":
    unittest.main()