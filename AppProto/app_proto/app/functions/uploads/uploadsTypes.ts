export interface uploadProgressState {
    finished: uploadFinishedObjects, 
    progress: uploadProgressObjects
}

export interface uploadProgressObjects {
    [index: string] : uploadProgressObj,
}

export interface uploadFinishedObjects {
    [index: string] : uploadFinishedObj,
}

export interface uploadInfo {
    [index: string]: string,
    batchName: string,
    dataFilePath: string, 
    newDataFilePath: string,
    loggingFilePath: string, 
    logFilePath: string,
    gpsFilePath: string, 
    startLatitude: string, 
    startLongitude: string, 
}

export interface uploadFinishedObj {
    [index: string] : any,
    graphs: any,
    cols: any,
    calcPath: string,
    uploadInfo: uploadInfo,
    uploadInfoArr: uploadInfoArr
}

export interface uploadProgressObj {
    // simply the currLength of uploadProgressObjects keys + 1 (index)
    [index: string] : any,
    uploadInfo: uploadInfo,
    uploadInfoArr: uploadInfoArr
}

export interface uploadProgress {
    [index: string] : string,
    processing: string,
    generating: string,
    saving: string 
}

export type uploadInfoArr = Array<batchInfo>;

export interface batchInfo { 
    [index: string] : string, 
    title: string,
    info: string
}

export type GenericUpdateProgress = AddProgress | RemoveProgress | RemoveProgresses | RefreshFinished; 

export interface AddProgress {
    type: typeof ADD_PROGRESS, 
    payload: uploadProgressObj
}

export interface RemoveProgress {
    type: typeof REMOVE_PROGRESS, 
    payload: number 
}

export interface RemoveProgresses {
    type: typeof REMOVE_PROGRESSES,
    payload: Array<string>
}

export interface UpdateProgressPayload {
    [index: string]: any,
    index: number, 
    progressStep: string,
    newProgress: string, 
}

export interface RefreshFinished {
    type: typeof REFRESH_FINISHED,
    payload: uploadFinishedObjects,
}

export const ADD_PROGRESS = 'ADD_PROGRESS';
export const REMOVE_PROGRESS = 'REMOVE_PROGRESS'; 
export const REMOVE_PROGRESSES = 'REMOVE_PROGRESSES';
export const REFRESH_FINISHED = 'REFRESH_FINISHED';

// class that returns mapping of upload progress number : upload progress info
// can get number of keys and then do +1 to get next index number
// can add function to class to get next index number
// store index number double --> store in object and store index number in upload progress info
// can immediately delete index number from map
// index number will act as unique identifier
// get progress string from index number and object (related)
// get uploadInfo and related values from index number and object (related)