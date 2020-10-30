** BEFORE TOUCHING THE SERVER DIRECTORY CODE, READ THIS TXT AND ALSO READ THE CODE THOROUGHLY**

WHAT IS ALL THIS?
- user_files --> self-explanatory, where uploaded files are stored
- csvmat.py --> script for mat --> csv conversion
- files.json --> information to link JavaScript and Python (see below)
- helper_json.py --> helper for csvmat.py 
- test_json.py --> TESTING PURPOSES (dev)
- test.json --> TESTING PURPOSES (dev) 


HOW DOES THIS WORK? 
- files.json is the main communicator between this 'server' (pseudo-server) directory and the JavaScript. JavaScript will write any changes to files.json and the pseudo-server, when the script is run, will be the one to read the files.json.

WHAT IS files.json? 
- As of now it holds key:value pairings in MAT FILE : CSV FILE or NONE, where NONE means the file has not been converted yet. This is where the communication happens...

... WHAT HAPPENS WHEN A USER UPLOADS?
- The JavaScript checks the files.json to see if the user has already uploaded the file before. If so, then it prevents the user from re-uploading until deletion.
- If the user is uploading a new file, then the JavaScript adds an entry of the MAT FILE : None, then executes the Python script. The Python script reads the json and finds the mat files with no corresponding csv files and creates them. 

WHAT IS THE DANGER? 
- The files.json could indicate that files have been converted when they do not exist (e.g. if someone manually deletes a .csv file from a .mat file that was just converted, then the python script would have no idea) 
- To mitigate this danger a 'validator.py' is under development to check for the existence of files in files.json. This module could be run by the JavaScript and/or python code (e.g. before csvmat.py reads from files.json) 