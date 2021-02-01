# How do you begin?

## If you are a developer...

## Setup

Make sure yarn and npm are installed.

1. Go to AppProto/app_proto
   
   1. Run 'yarn' or the equivalent installation method if this becomes out-dated
   
   2. Run 'npm install' or the equivalent installation method if this becomes out-dated

2. Go to AppProto/app_proto/app
   
   1. Run the same commands as above

3. Navigate to AppProto/app_proto again
   
   1. Run 'yarn dev'
   
   2. Fix any errors as they appear 

## Additional Setup

### Python

* Make sure you have Python installed. Anything Python 3 that is <= 3.8 should theoretically work. If not, it is your responsibility to find out what works.

* There are two scripts folders that the app uses:
  
  * AppProto/app_proto/app/scripts
    
    * This is only for production or for use in testing with PyInstaller. In other words, it runs the packaged version of the python scripts in scripts_dev so that no Python dependencies are required. 
  
  * AppProto/app_proto/app/scripts_dev
    
    * This is what you and your app will likely be using.
      
      * If you go to AppProto/app_proto/app/functions/exec/process.tsx you will be able to see the code directly. 
        
        * Take a look at the **processFile** function. The python script name and script name show the difference in the directories. The python script name is what is executed when the app detects that you are in development, along with the correct path. The script name is what is executed when the app detects that you are in production, along with the correct path. 
        
        * The app uses a series of functions, including those in AppProto/app_proto/app/functions/paths.tsx to get the correct path to the scripts or scripts_dev folder depending on whether it detects that you are in development or production. 

* **How to get the Python working in development**
  
  * Only in production (you are not in production) will you not need to have Python locally installed. In this case, you MUST install Python locally along with all the dependencies required. 
  
  * HOW TO:
    
    1. Install Python  
       
       1. Global Installation    
          
          1. This is Python on your machine WITHOUT a separate virtual environment. As long as you install the dependencies, this will work, because the app automatically assumes it should use the globally available Python (It calls python scripts by literally using the word`python3`).
       
       2. Virtual Environment Installation
          
          1. This is a separate virtual environment you have created. You will have to go to AppProto/app_proto/app/functions/constants.tsx and change the 'python3' variable to the path to the executable in this separate virtual environment. It typically works, but, if it does not, it is up to you to debug it.
    
    2. Install Dependencies
       
       1. You must do this manually.
       
       2. One way is...
          
          1. Go to the scripts_dev folder and try to run a script like process.py. Python will automatically keep failing if you are missing dependencies. So, install, then repeat, until you get a response from the script. Once you get a response, then you know you have all the required dependencies. 
    
    



# Licenses

**Electron React Boilerplate was used to quick start the project development**: 

The MIT License (MIT)

Copyright (c) 2015-present Electron React Boilerplate

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
