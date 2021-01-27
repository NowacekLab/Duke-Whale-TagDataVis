import {useState, useEffect} from "react";
import {uploadFile} from "./upload";

export type uploadProgressIndicator = "fail" | "success" | "progress";

export interface uploadArgs {
    [index: string] : string,
    dataFilePath: string, 
    newDataFilePath: string,
    loggingFilePath: string, 
    logFilePath: string,
    gpsFilePath: string, 
    startLatitude: string, 
    startLongitude: string, 
}

export interface uploadProgress {
    [index: string] : string,
    processing: uploadProgressIndicator
    generating: uploadProgressIndicator
    saving: uploadProgressIndicator 
}

const defaultUploadProgress: uploadProgress = {
    processing: "progress",
    generating: "progress",
    saving: "progress"
}

const defaultUploadArgs: uploadArgs = {
    dataFilePath: "",
    newDataFilePath: "",
    loggingFilePath: "",
    logFilePath: "",
    gpsFilePath: "",
    startLatitude: "",
    startLongitude: ""
}

export default function useUpload() {
    /**
     * uploadState must be changed to a new object
     * for changes to be detected and uploading to 
     * occur 
     */

    const [uploadProgress, setUploadProgress]  = useState(defaultUploadProgress);

    const beginUpload = (uploadArgs: uploadArgs, uploadProgressStart: any) => {
        uploadProgressStart();
        uploadFile(uploadArgs, uploadProgress, setUploadProgress);
    }

    return [uploadProgress, setUploadProgress, beginUpload]

}

export function resetUploadProgress(setUploadProgress: any) {
    const newDefaultUploadProgress = Object.assign(defaultUploadProgress);
    setUploadProgress(newDefaultUploadProgress);
}

export function resetUploadArgs(setUploadArgs: any) {
    const newDefaultUploadArgs = Object.assign(defaultUploadArgs);
    setUploadArgs(newDefaultUploadArgs);
}

// 'processed'
// 'graphs'