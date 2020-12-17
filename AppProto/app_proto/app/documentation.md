https://support.typora.io/Markdown-Reference/

[toc]



# other

## store

## index

## rootReducer

## main.dev

# pages

## App

## AppsPage

## Base

## GraphsPage

## HomePage

## InfoPage

## Root

## SettingsPage





# containers

## Apps

## Graphs

## Home

## Info

## Settings



# components



## AppsTable

### Params:

* setselectedGraphFile
* selectedGraphFile
* closeModal

### Dependencies:

* **FileTable [custom component]**
* Material UI 



## HomeTable

### Params:

* setFileNum
* fileNum

### Dependencies:

* **FileActions [custom component]**
* **FileTable [custom component]**
* Material UI 



## FileTable

### Params:

* selectedFile
* setSelectedFile
* updateTableView
* fileNum
* setFileRows

### Dependencies:

* Material UI 



## FileActions

### Params:

* refreshTableView
* selectedFile
* fileRows

### Dependencies:

* **UploadProgress [custom component]**
* **Confirmation [custom component]**
* **Notification [custom component]**
* Material UI 



## UploadProgress

### Params:

* uploadProgress
* uploading
* uploadingNotReprocessing
* finishedUploading
* updateUploadStateIndicator
* refreshTableView
* resetUploadState

### Dependencies:

* Material UI 



## Confirmation

### Params:

* open
* close
* title
* desc
* reject
* confirm

### Dependencies:

* Material UI 



## Notification

### Params:

### Dependencies:

* Material UI 



## SideBarContent

### Params:

### Dependencies:

* **SideBarComp [custom component]**
* Material UI 



## SideBarComp

### Params:

* children

### Dependencies:



# functions 

## forceLoad

## notifs

## useIsMounted



