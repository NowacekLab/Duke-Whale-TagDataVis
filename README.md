# Data-Visualization-MAPS

# 'App Proto' Specific

## High level overview
- Electron provides for the desktop app functionality, acting as a pseudo-browser of sorts
- React is a JavaScript library that helps accelerate frontend development with reusability/modularity
- To combine the two in a fast, timely manner **react-electron-boilerplate (open source)** was used, so that is why there is a 'license' (the standard MIT license that says it is open source and can be used anywhere and everywhere)

## Keep in mind...
- This is not a packaged version of the app so it is not executable like a normal desktop app
- It is primarily for devs to communicate and see/make changes

## So, how do you begin?
Make sure npm and yarn are installed
1. Run 'npm install' THEN 'yarn add' inside the folder after pulling. 
2. If not all dependencies were installed, then install them using **yarn**
3. Run 'yarn dev' to be able to inspect element, 'npm start' for a more isolated run (you will likely use 'yarn dev')

### I ran into an error!
Check if the error is...
- A system error (your system is missing some files or has wrong paths set up)
- A dependency error (you are missing a dependency or yarn and npm aren't playing well...then refer to the above beginning steps)

Still not working?
- Go to Google, Stack, ... and look for an answer, try debugging
- Last resort, contact Joon Young (not for any special reason, he just set up this framework first so he might be able to debug it fast)
