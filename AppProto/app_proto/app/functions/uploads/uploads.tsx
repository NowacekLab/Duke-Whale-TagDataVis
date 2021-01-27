/**
 * Helper functions for dealing with 
 * Session Storage when it comes to
 * Upload Progress
 */


//TODO: CHANGE THIS TO REDUX, THE SAME IDX CONCEPT CAN BE USED WITH AN ARRAY IN REDUX 




const uploadsKey = 'uploads';

export function getUploads() {
    const temp = localStorage.getItem(uploadsKey);
    const uploads = temp ? JSON.parse(temp) : [];
    return uploads; 
}

export interface uploadObj {
    // simply the currLength of uploads + 1 
    [index: string] : any,
    index: number, 
    progress: string, 
    uploadInfo: uploadInfo
}

export interface uploadInfo {
    [index: string] : string, 
    dataFileName: string, 
    logFileName: string,
    GPSFileName: string, 
    startLatitude: string,
    startLongitude: string,
}

export function addUpload(newUpload: uploadObj) {
    const uploads = getUploads();
    uploads.push(newUpload);
    saveUploads(uploads);
}

export function removeUpload(uploadObj: uploadObj) {

    const idx = uploadObj['index'];
    const uploads = getUploads();
    const newUploads = uploads.filter(oldUploadObj => oldUploadObj['index'] !== idx);
    return saveUploads(newUploads);
}

export function clearUploads() {
    saveUploads([]);
}

function saveUploads(uploads: Array<uploadObj>) {
    const JSONStr = JSON.stringify(uploads, null ,4);
    localStorage.setItem(uploadsKey, JSONStr);
    return uploads; 
}