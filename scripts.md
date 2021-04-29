# Plotting Function Documentation
This is documentation for the plotting functions that were included in the scripts_dev part of the application folder. 

# mahalanobis.py
This script was written so that researchers could make easy use of mahalanobis distance to analyze their data. As the primary goal of our project was to create a tool for data exploration, we made the function flexible for the user so there is room to adjust the variables and inputs. It incorporates two different functions, mahalanobis() and findPOI(). The methods used stem from the work of Miller et al 2014 in “Dose-response relationships for the onset of avoidance of sonar by free-ranging killer
whales”, specifically the technique for finding the average Mahalanobis distance across windows of data. 

### mahalanobis()
The first function is the mathematical implementation of mahalanobis distance across three columns of data. This function is credited to Selva Prabhakaran, who explains the function and the concepts of mahalanobis distance in “Mahalanobis Distance - Understanding the math with examples (python)” {https://www.machinelearningplus.com/statistics/mahalanobis-distance/}. This function is repeatedly called within the main function, findPOI().

### findPOI()
This function serves as the main body of the script. It takes a data file, three variables across which you’d like to find the mahalanobis distance, a p-value for statistical analysis, a window and group size, and a depth limit.

The function starts by pulling together the nececarry data as well as defining some constant variables for use in calculations. findPOI() operates by progressing a section across the data and pulling the mahalanobis distance for each point in this section of data. It may be helpful to think of this operation as a list of n lists (n being the group size) where each internal list contains, by default, 1 minute of data (which would look something like this: [[1-60], [61-120], [121-180], …, [the n’th 60 sec group] ]). The mahalanobis distance is then calculated across the next section of data, which would look something like this: [[61-120], [121-180], …, [the n’th 60 sec group], [the (n+1)’th 60 sec group]]. The data would actually by in a singular list, but the grouping helps to visulaize the underlying concepts. 

The “mean_df” dataframe in combination with a zero-initialized list, “l_mahala”, of the same length as the full dataset help to track these sections of data and pull the mean distance across intersecting groups. The group size specified by the user deifnes how many columns are in the “mean_df” dataframe. The group size is also the number of windows that will overlap for every section other than those at the begining and the end of the data. The function for loops through the number of windows, iterating the section of data one window length forward each time, pulling the mahalanobis distances of the points in that group and storing them in “mean_df”. The average is then found for the mahalanobis distance of overlapping windows and stored in “l_mahala”. The if-tree logic consists of determining whether the section is at the beginning of the data (for initializing mean_df) or end of the data (handling the very last window which will most likely not be of equal length to the other sections). 

After finding the mean mahalanobis distances for each window, p-values are found using scipy.stats’ chi2.cdf() function. If the p-value is below the specified limit by the user and below the specified depth limit, the corresponding point in the dive will be marked as a point of interest (POI). A figure is then composed with two subplots, one for the dive path and one of the three variables compared with mahalanobis distance. The points of interest are also then plotted on the dive path. 

Plotly’s scattergl is used to minimize lag with such large datasets; however, a datetime axis cannot be used with scattergl, so the x-axis is plotted in terms of hours instead. 

# wavelets.py
This script is composed of one function, plotWavelets.py, which applies a maximal overlap discrete wavelet transform (MODWT) upon a specified variable. I implemented the MODWT since it was noted in multiple papers for use with pattern recoginition. The pyWavelets package does not include a MODWT function, but an open source MODWT function is offered by pistonly on Github {https://github.com/pistonly/modwtpy.git}. The plotWavelets.py function takes a long time to run mostly due to the MODWT function. Future work could be focused on reducing the expense of this function by potentially finding an equivalent way to utlize the pyWavelets package which is more otipimized than pistonly’s MODWT function.

The data processing portion of this function is relatively simple. The variable, wavelet type, and number of scales are designated by the user and the MODWT coefficients are found. Points of interest are determined by applying scipy.signal’s find_peaks() function on the coefficients. The prominence of this function determines how lenient the function will be in determining points of interest and is defined by the user (defualt set to 0.1). The bulk of this function goes towards configuring the plots. By defualt the points of interest are found from the middle scale; however, if the user would like to see all sacles and their corresponding points of interest a boolean value, “showLevels”, can be set to true. This will pull up a second plot that contains a subplot for each level and a plot of the variable of interest. This second figure makes use of the marker color option and the legendgroup option to link features across subplots. 

The main figure has two subplots, one for the depth and one for the variable of interest. An if statement is used to determine if the boolean input “colorByVar” is activated. If so, the depth will be plotted with a colorscale corresponding to the variable of interest. One of the consistent pieces of feedback we recieved was the addition of colorscales into the plots, so we added this feature to a allow for more play with the data and appeal to this interest. 

### Sources on Wavelets
The following sources are compiled to help familiarize oneself with wavelets:

R. C. Guido, P. S. Addison and J. Walker, “Introducing wavelets and time—frequency analysis [Introduction to the special issue],” in IEEE Engineering in Medicine and Biology Magazine, vol. 28, no. 5, pp. 13-13, September-October 2009, doi: 10.1109/MEMB.2009.934243.

R. C. Guido, “Practical and Useful Tips on Discrete Wavelet Transforms [sp Tips & Tricks],” in IEEE Signal Processing Magazine, vol. 32, no. 3, pp. 162-166, May 2015, doi: 10.1109/MSP.2014.2368586.

R. C. Guido, “A note on a practical relationship between filters coefficients and the scaling and wavelet functions of the discrete wavelet transform,” Appl. Math. Lett., vol. 24, no. 7, pp. 1257–1259, 2011.

M. Oren, C. Papageorgiou, P. Sinha, E. Osuna and T. Poggio, “Pedestrian detection using wavelet templates,” Proceedings of IEEE Computer Society Conference on Computer Vision and Pattern Recognition, San Juan, PR, USA, 1997, pp. 193-199, doi: 10.1109/CVPR.1997.609319.

S. Pittner and S. V. Kamarthi, “Feature extraction from wavelet coefficients for pattern recognition tasks,” in IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 21, no. 1, pp. 83-88, Jan. 1999, doi: 10.1109/34.745739.

https://towardsdatascience.com/the-wavelet-transform-e9cfa85d7b34 

# findDives.py
This script contains a single function called plotDives(). This function plots all dives that meet specified criteria by the user against one another. The criteria available are minimum dive length (must not return to the surface for x amounnt of time), required depth (must reach this depth before the dive counts), and max depth (dives below this depth do not count). A list of interest variables can also be inputed which will create a subplot for each variable where the dives are colorscaled based on that variable. 

The first step is pulling in the depth data. Then a surface is defined. The standard deviation of the first 2 seconds of data is found. Since the whale is tagged at the surface, we assume the first two seconds of data should be at 0, providing a good indication of the surface. A variable called surface is defined to be a binary list equal in length to the data set, where all corresponding indexes of the depth data that are within 6 standard deviations of the surface are set to 1. We then find all indexes where surface == 1 and break this list into seperate lists of dive indexes (i.e. seprate dives are defined to be where the difference of two consecutive idexes is greater than 1).

A dive dictionary is then created to attach extra data to each dive. The list of dive indexes are then processed and recorded in the dictionary if they meet the criteria defined by the user. The extra information recorded with each dive includes name, depth data, time data, and the corresponding idex values. This information is primarily for ease of plotting. A subfigure is created for each interest variable, and if there are no interest variables one figure without subplots is created. Each dive was plotted with a colorscale based on all interest variables. The legendgroup and showlegend features of Plotly’s Scattergl() were used to control all subplots with one set of legend keys. The colorbar feature of the marker option of Scattergl() was also defined, providing locations to prevent overlap of colorbars and align colorbars with their corresponding subplot. 

An error is outputed if no dives are found at the end of the function. 

# acoustic.py
Script for plotting .wav format acoustic data, designed to work with two channel audio

### acousticPlot()
The method takes in a file path string to the wav file for import. The function uses a two-way sliding viewport method to plot the data without crashing due to memory, as each wav file is usually massive in size. The default framesize is defined in method as 100. The data is first plotted in both time and frequency domains, before allowing for plot updating.

At the bottom, sliderDist and sliderRange are used to control the beginning data index and the amount of data viewed on the graph respectively (the latter is upper bounded by 1,000,000 by experiment as the lowest value that prevents high lag).

### update()
Helper function that is called to update the graph based on slider input. It uses the same plotting functions as in acousticPlot(), but has variable inputs based on the sliders that control the number of plotted points and location of plotting.

# precalcs.py
Main function that processes the raw data (after converted from mat to csv). Calculates values of interest, such as time points, lat/long (if provided GPS data), X/Y position, and jerk values.

### _xydistance()
Takes in two lat/long pairs and returns the distance in meters between them based on an average haversine function

### _haversine()
Takes in two lat/long pairs and applies the haversine function to return an absolute distance between the two points in meters. Assumes N and W as positive, unlike N E convention for lat/long

### _inverseHaversine
Opposite of haversine function—takes in a latitude, longitude, distance, and bearing, then calculates the corresponding latitude and longitude from it. Taken from http://www.edwilliams.org/avform.htm#LL

### _preCalc()
Takes in a list of command line arguments that require the raw data, a starting time, and optional GPS file and start long/lat. Roll and Acceleration data is pulled from the raw data file. The variables v and maxVelocityScale represent an assumed constant velocity if no GPS file is provided, and a maximum expected velocity for checking the accuracy of the GPS fit respectively.

dx is the displacement array, j is the jerk array, and t is the time array. Latitude and longitude arrays are also created as latArray and longArray. Afterwards, there are two possible paths depending if a GPS file was created:

-No GPS:
Use the RPY angles to create a quaternion that represents direction, and use that to rotate the whale. The v constant described above represents absolute velocity, so project_vec and angle are used to get dv, the velocity in the XY plane specifically. This velocity is then used to populate the displacement array, dx, and jerk is calculated with a simple derivative.

-With GPS:
If the GPS is included, the gps must be read and parsed by stripping the time of all GPS entries and converting them to seconds since tag start. The GPS data is also filtered to visual sightings only. Afterwards, latitude and longitude data for the boat are stripped from the GPS file and used to get the latitude/longitude of the whale based on the measured bearing and range. These numbers are converted to displacement in meters using  _xydistance(), based on the haversine function. Afterwards, the code proceeds very much like the no-GPS case with the exception that every cycle of the loop, the code will check whether it has hit one of the GPS time markers. If it has, it will attempt to scale all data points since the last GPS point by a common scaling factor to force the data to line up with the current GPS point at the current time. After parsing all the data, the code finally calculates the lat/long of each point and populates them into latArray and longArray, as well as calculating the total velocity at each point to ensure that the GPS fitting has not done any weird stretching to produce odd results.

At the end, all data is written to a pandas dataframe, and exported to csv. 

# trackplot.py
Function to plot a 3d dashboard of whale movement data, along with X/Y movement track and depth plot with interactive slider and play.

### trackplot()
Takes input as a string to a csv file produced/in the format of precalcs.py. Uses a player model based on a player created by ImportanceOfBeingErnest [https://stackoverflow.com/questions/46325447/animated-interactive-plot-using-matplotlib], modified slightly to incorporate color changes. The code starts by defining a dcf decimation factor to cut down the data to reduce lag. The csv is then read into a dataframe and XYZ data is pulled from it, as well as time. The figure is then split into ax (3d plot), ax_xy (X-Y displacement plot), and ax_d (depth vs. time plot). Initial plots are made of the three plots described using XYZ data. An update function is provided to update the graph by using RPY data to rotate a triangle representing the whale to a proper location and orientation, which is then moved along the 3d plot along with the camera. The depth and XY plots are also updated with a point on the graph. At the end, an option is given to export the graph as gif using exportFig(), as well as to show the plot after creating an animation object.

### intPlot()
Plot show method incorporated into a function for future use with multithreading of gif export and interactive figure.

### exportFig()
Figure export as gif using Pillow, incorporated into a function for future use with multithreading of gif export and interactive figure.


 #class/whale
