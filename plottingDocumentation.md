# mahalanobis.py
This script was written so that researchers could make easy use of mahalanobis distance to analyze their data. As the primary goal of our project was to create a tool for data exploration, we made the function flexible for the user so there is room to adjust the variables and inputs. It incorporates two different functions, mahalanobis() and findPOI(). The methods used stem from the work of Miller et al 2014 in "Dose-response relationships for the onset of avoidance of sonar by free-ranging killer
whales", specifically the technique for finding the average Mahalanobis distance across windows of data. 

### mahalanobis()
The first function is the mathematical implementation of mahalanobis distance across three columns of data. This function is credited to Selva Prabhakaran, who explains the function and the concepts of mahalanobis distance in "Mahalanobis Distance - Understanding the math with examples (python)" {https://www.machinelearningplus.com/statistics/mahalanobis-distance/}. This function is repeatedly called within the main function, findPOI().

### findPOI()
This function serves as the main body of the script. It takes a data file, three variables across which you'd like to find the mahalanobis distance, a p-value for statistical analysis, a window and group size, and a depth limit.

The function starts by pulling together the nececarry data as well as defining some constant variables for use in calculations. findPOI() operates by progressing a section across the data and pulling the mahalanobis distance for each point in this section of data. It may be helpful to think of this operation as a list of n lists (n being the group size) where each internal list contains, by default, 1 minute of data (which would look something like this: [[1-60], [61-120], [121-180], ..., [the n'th 60 sec group] ]). The mahalanobis distance is then calculated across the next section of data, which would look something like this: [[61-120], [121-180], ..., [the n'th 60 sec group], [the (n+1)'th 60 sec group]]. The data would actually by in a singular list, but the grouping helps to visulaize the underlying concepts. 

The "mean_df" dataframe in combination with a zero-initialized list, "l_mahala", of the same length as the full dataset help to track these sections of data and pull the mean distance across intersecting groups. The group size specified by the user deifnes how many columns are in the "mean_df" dataframe. The group size is also the number of windows that will overlap for every section other than those at the begining and the end of the data. The function for loops through the number of windows, iterating the section of data one window length forward each time, pulling the mahalanobis distances of the points in that group and storing them in "mean_df". The average is then found for the mahalanobis distance of overlapping windows and stored in "l_mahala". The if-tree logic consists of determining whether the section is at the beginning of the data (for initializing mean_df) or end of the data (handling the very last window which will most likely not be of equal length to the other sections). 

After finding the mean mahalanobis distances for each window, p-values are found using scipy.stats' chi2.cdf() function. If the p-value is below the specified limit by the user and below the specified depth limit, the corresponding point in the dive will be marked as a point of interest (POI). A figure is then composed with two subplots, one for the dive path and one of the three variables compared with mahalanobis distance. The points of interest are also then plotted on the dive path. 

Plotly's scattergl is used to minimize lag with such large datasets; however, a datetime axis cannot be used with scattergl, so the x-axis is plotted in terms of hours instead. 

# wavelets.py
This script is composed of one function, plotWavelets.py, which applies a maximal overlap discrete wavelet transform (MODWT) upon a specified variable. I implemented the MODWT since it was noted in multiple papers for use with pattern recoginition. The pyWavelets package does not include a MODWT function, but an open source MODWT function is offered by pistonly on Github {https://github.com/pistonly/modwtpy.git}. The plotWavelets.py function takes a long time to run mostly due to the MODWT function. Future work could be focused on reducing the expense of this function by potentially finding an equivalent way to utlize the pyWavelets package which is more otipimized than pistonly's MODWT function.

The data processing portion of this function is relatively simple. The variable, wavelet type, and number of scales are designated by the user and the MODWT coefficients are found. Points of interest are determined by applying scipy.signal's find_peaks() function on the coefficients. The prominence of this function determines how lenient the function will be in determining points of interest and is defined by the user (defualt set to 0.1). The bulk of this function goes towards configuring the plots. By defualt the points of interest are found from the middle scale; however, if the user would like to see all sacles and their corresponding points of interest a boolean value, "showLevels", can be set to true. This will pull up a second plot that contains a subplot for each level and a plot of the variable of interest. This second figure makes use of the marker color option and the legendgroup option to link features across subplots. 

The main figure has two subplots, one for the depth and one for the variable of interest. An if statement is used to determine if the boolean input "colorByVar" is activated. If so, the depth will be plotted with a colorscale corresponding to the variable of interest. One of the consistent pieces of feedback we recieved was the addition of colorscales into the plots, so we added this feature to a allow for more play with the data and appeal to this interest. 

### Sources on Wavelets
The following sources are compiled to help familiarize oneself with wavelets:

R. C. Guido, P. S. Addison and J. Walker, "Introducing wavelets and time--frequency analysis [Introduction to the special issue]," in IEEE Engineering in Medicine and Biology Magazine, vol. 28, no. 5, pp. 13-13, September-October 2009, doi: 10.1109/MEMB.2009.934243.

R. C. Guido, "Practical and Useful Tips on Discrete Wavelet Transforms [sp Tips & Tricks]," in IEEE Signal Processing Magazine, vol. 32, no. 3, pp. 162-166, May 2015, doi: 10.1109/MSP.2014.2368586.

R. C. Guido, “A note on a practical relationship between filters coefficients and the scaling and wavelet functions of the discrete wavelet transform,” Appl. Math. Lett., vol. 24, no. 7, pp. 1257–1259, 2011.

M. Oren, C. Papageorgiou, P. Sinha, E. Osuna and T. Poggio, "Pedestrian detection using wavelet templates," Proceedings of IEEE Computer Society Conference on Computer Vision and Pattern Recognition, San Juan, PR, USA, 1997, pp. 193-199, doi: 10.1109/CVPR.1997.609319.

S. Pittner and S. V. Kamarthi, "Feature extraction from wavelet coefficients for pattern recognition tasks," in IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 21, no. 1, pp. 83-88, Jan. 1999, doi: 10.1109/34.745739.

https://towardsdatascience.com/the-wavelet-transform-e9cfa85d7b34 

# findDives.py
This script contains a single function called plotDives(). This function plots all dives that meet specified criteria by the user against one another. The criteria available are minimum dive length (must not return to the surface for x amounnt of time), required depth (must reach this depth before the dive counts), and max depth (dives below this depth do not count). A list of interest variables can also be inputed which will create a subplot for each variable where the dives are colorscaled based on that variable. 

The first step is pulling in the depth data. Then a surface is defined. The standard deviation of the first 2 seconds of data is found. Since the whale is tagged at the surface, we assume the first two seconds of data should be at 0, providing a good indication of the surface. A variable called surface is defined to be a binary list equal in length to the data set, where all corresponding indexes of the depth data that are within 6 standard deviations of the surface are set to 1. We then find all indexes where surface == 1 and break this list into seperate lists of dive indexes (i.e. seprate dives are defined to be where the difference of two consecutive idexes is greater than 1).

A dive dictionary is then created to attach extra data to each dive. The list of dive indexes are then processed and recorded in the dictionary if they meet the criteria defined by the user. The extra information recorded with each dive includes name, depth data, time data, and the corresponding idex values. This information is primarily for ease of plotting. A subfigure is created for each interest variable, and if there are no interest variables one figure without subplots is created. Each dive was plotted with a colorscale based on all interest variables. The legendgroup and showlegend features of Plotly's Scattergl() were used to control all subplots with one set of legend keys. The colorbar feature of the marker option of Scattergl() was also defined, providing locations to prevent overlap of colorbars and align colorbars with their corresponding subplot. 

An error is outputed if no dives are found at the end of the function. 
