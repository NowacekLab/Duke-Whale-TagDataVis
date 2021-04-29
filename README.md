# Introduction
Welcome to Whale! This project began with a group of undergraduate Duke University students, a mix of engineers and developers, joining Dr. Nowacek’s project to create a new data visualization software for whale researchers. 

Though originally stemming from a desire to have a software able to process data files and create a 3D visualization of a whale swimming, it has evolved to have much more functionality and capabilities, including processing support for many common data tag files, graph creation and editing and exports, complex calculations and plots (i.e. Wavelets), and much more!

# Project Structure
The project’s underlying structure is largely derived from [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). 

As an overview, the project’s user interface is built primarily with JavaScript using Electron, React, Redux, and Material UI React. The majority of the project’s processing and graphing is done using Python scripts executed as child processes by the JavaScript. 

`src` 
contains all of the app’s content. 

`src/app`  
contains all of the app’s code. 

## JavaScript / UI
`src/app/pages`
About the highest-level UI parts. They are used to display pages. 

`src/app/containers`
Containers help make up parts of pages when necessary. 

`src/app/components`
Components help make up containers and also other components. 

`src/app/functions`
Help with client-side data management (i.e. keeping track of files, deleting files) and, importantly, execute python scripts as child processes. 

## Python / Processing & Graphing 
`src/app/scripts_dev`
Raw python scripts that are unpackaged. Only suitable for development environment where system python has all of the necessary packages installed. 

`src/app/scripts`
Packaged versions of scripts_dev python scripts. Suitable for deployment when packaging the application.

# How to... 
## Develop
#### Setup Instructions: 
Make sure yarn and npm are installed. 

1. Go to `src` and run ‘yarn’ then ‘npm install’.
2. Go to `src/app` and repeat the commands.

Make sure python3 is installed on your system. The project was only tested with later versions of python3. 
1. Go to the base directory of the project and look for requirements.txt. 
2. Run pip3 install -r requirements.txt. 
3. Test installation by going to `src/app/scripts_dev` and repeatedly run ‘python3 main.py’ (for mac, for windows may be different to run main.py with your system python3). If it gives any modulenotfounderror, then install that module as well, otherwise you’re good to go. 

To make sure the application runs on your computer:
1. Go to `src` and run ‘yarn dev’ to start up the application in development.
2. Try running commands in the application. If some actions do not work, it may be that the specific data file combination or otherwise that you uploaded or tried to do may not work. Try doing a variety of other combinations. If it still does not work, then:
	1. Assume that it is a problem with your local development environment and check to see what is not working with debuggers, print statements, ... . Make sure to remove any of these changes you make after. 
	2. If you’ve verified it is not a problem with your local development environment or still cannot find the issue, then jot down everything you did and make a formal issue in the Github repository. 

#### Writing Python Code
Firstly, *all* scripts go through main.py. This is to reduce packaging time (see below at packaging application) and the overall size of the application.

Second, the existing convention is to make an entirely separate script named its functionality (i.e. mahalanobis.py for mahalanobis distance). There *must* be a main() function inside that follows the conventions of the other scripts that main.py uses. That is, it gets arguments from the CMD line and pulls them out to do with them as it will. 

Third, once you have tested that script, then add it to main.py. The string key you give it in the dictionary is the string key that the JavaScript scripts will have to pass when calling main.py. 

#### Writing JavaScript Code 
Firstly, make sure you understand generally what the files do, where they are located, and what you have available to you. You do not want to ideally reinvent the wheel with the code (don’t fix it if it ain’t broke) unless it is, well, broken or that change could yield significant benefits. 

The UI code, as explained above, is primarily contained in pages, containers, and components. The functions contain the scripts that contain lots of business logic for handling user information and the python scripts. 

*If you are adding code that is similar in functionality or otherwise to existing code in the codebase, you must conform to the conventions of the existing code or change both code places and explain why.* For example, if you peruse through components you’ll notice that Dives, Wavelets, and others that are also actions have similar structures and, within files, use similar layouts and logic. The abstractions may not be perfect, but this does make it easier for someone to add additional functionality that is similar. So, for instance, if someone wanted to add another action then they could copy and paste a directory like that of Dives, and make the necessary adjustments. 

*If you are adding additional UI*, then do note that most of the UI and appearance of the application either goes through the global css files or heavily relies on Material UI React, both with styling using JavaScript and the components. 

#### Contributing

Whatever it is that you’d like to contribute, please feel free to!

But first, read [Guide on open source contributing](https://opensource.guide/how-to-contribute/).

We do not yet have formal guidelines on contributing in terms of the format, content, ... . Please use your best judgement. You can even contribute by helping set the guidelines! 

## Package Application

#### Python Packaging
Ensure that the newest versions of the required scripts in scripts_dev are packaged using **pyinstaller**. Pyinstaller has some bugs, but it is the best way to package the python scripts. **Pyinstaller, similar to Electron, must be used on the platform for which the scripts are intended**. This means that you must package the scripts on Mac or Windows to get scripts that run on, respectively, Mac or Windows. 

Here are the steps:
1. Run pyinstaller on *main.py*. Do NOT do onefile mode. It is disabled by default, so do not worry unless you were trying to do it. Then copy the directory named ‘main’ from ‘dist’ in scripts_dev to scripts.
2. You should test that it works. You can try running it manually and running the development environment with ‘isDev’ in constants turned to ‘False’ (you must revert this afterwards). 

If it doesn’t work:
Don’t panic. There are known issues with pyinstaller. Among those are:
* Not properly installing plotly. 
	* One possible solution: Add the path to your local system installation of plotly to the ‘datas’ part of the .spec file that pyinstaller generates on your first packaging attempt of main.py. It would be in the following form: `datas=[(“PATH_TO_PLOTLY”, “plotly”)]`. You will then need to run pyinstaller again and specify the .spec file. 
	* Another possible solution: Finding the plotly installation in your local system and copy and pasting it into the main directory generated by pyinstaller.
* Not installing matplotlib dependencies.
	* You have to detect what these dependencies are as they seem to vary per platform or might not even occur. Then copy and paste them into the main directory where they belong or otherwise.
* Requiring some ‘cmath’ import.
	* One possible solution: Add to the .spec file that pyinstaller generates on your first packaging attempt of main.py: `hiddenimports=[“cmath”]`

If you face other issues, then please try to resolve them fully before raising an issue. Afterwards, report what you tried in your issue. It can help detect what other faults people may face in using pyinstaller! 

#### Application Packaging

Ensure that the development application runs when ‘isDev’ in constants is set to False first. This is an initial mocking of a production environment to make sure the application runs before packaging it. 

Go to `src` and run ‘yarn package’. It will package it only for YOUR computer environment. As stated above with pyinstaller, this means that Mac and Windows versions must be packaged on, respectively, a mac or a windows computer. 

# Want to help?
## Developers

#### Firstly...
1. **Read through this ~entire~ README**.
2. If you haven’t already, get a feel for the codebase, try running the application, changing things (don’t forget to change back or just use a copy) and breaking things, and whatever else helps you. 

#### Secondly... we have a running list of To Dos

**These are very important and integral to the continued growth of this project. So they are top priority alongside new additions and edits to the functionality.** 

* Improving error messages. 
	* Easier for JavaScript-only code. Much harder for code that executes a python child process. Ideally, we want python script errors to be reliably saved, able to be displayed to user based on results, and more. 

* Adding more failsafe checks.
	* Many of the failsafe checks are to ensure that the necessary files are created in the user files repository. 
	* To give an example, consider that the code defaults to creating an empty cols.json file (*if you don’t recognize this, go back to looking at the codebase and the files it generates*) when it cannot process the variables of the datafile. Combined with the unhelpful error messages (see improving error messages), this means that a user trying to do anything with variables will encounter an error likely.
	* *A very important failsafe check is ensuring no data loss occurs because multiple actions are executed together and write to the same file at once. One way to do this is to throttle a user’s actions by only allowing one at a time for actions that may conflict.* Additionally, see the action display to do below. 

* Adding tests. 
These were neglected in the initial development because the focus was on creating iterative new versions quickly, akin to an MVP. 
	* Adding tests for scripts.
		* The python scripts in scripts_dev and javascript scripts in functions desperately require unit tests. They also need to be refactored to be more conducive to unit tests.
	* Integration tests.
		* An integration test should ideally mock or actually conduct an automated UI test of executed actions. There are *caveats*.
		* Doing tests of where a UI component is (i.e. center) and doing tests of each UI component are less important. Doing tests of mocking calls to python scripts form the JavaScript code like a user and making sure they execute is *extremely helpful*. Especially if it can help automate the testing of a pyinstaller packaged script *and* get nice error messages (see improving error messages). 

* Automating python packaging alongside electron packaging

This includes finding a way to make the pyinstaller errors fixed, such as by creating a .spec file for everyone to use when packaging (although this may not work foolproof). Ideally, should be 1-2 commands like with ‘yarn package’, which may include custom scripts that move the ‘main’ directory from ‘dist’ automatically to ‘scripts.’

* Adding an ‘in progress’ action display. 

This would best be put in the notifications display, perhaps making two tabs that can be clicked and switched between in the notifications display between notifications and progress. 

## Otherwise
You can skip the development aspects if you want nothing to do with the code.

An important to do is to make this repository more robust for new contributors (i.e. tags, improving this README and/or making a separate CONTRIBUTORS.md, setting contribution guidelines, and more). 

You can help by reaching out at the contact below, raising an issue in Github, making pull requests, and much more! 

Any help is appreciated. 


# Contact 
#### Supervisor / Funder

The primary supervisor and funder of this project is [The Nowacek Lab at Duke University](https://sites.nicholas.duke.edu/nowacek/?_ga=2.219902745.1275129485.1619719628-473032543.1589967418). 

#### Developers

This is a list of the developers who have consented to being contacted. 
If one of them do not respond, then please try contacting another. 

* Joon Young Lee, joonyoung.lee@duke.edu
	* Worked on project and application structure, user interface code, JavaScript scripts, python upload process scripts, packaging
* Mitchell Frisch, harold.frisch@duke.edu
	* Worked on critical python action scripts, including mahalanobis distance, wavelets, and depth 
* Vincent Wang, vincent.y.wang@duke.edu
	* Worked on critical python action scripts, including 3D animations, and expanded file processing support 
