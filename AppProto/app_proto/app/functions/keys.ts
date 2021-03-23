import {getKeyFromObj, addValToObj} from "./object_helpers";

// Required information for uploading 
const dataFilePathKey = 'dataFilePath';
const newDataFilePathKey = 'newDataFilePath';
const loggingFilePathKey = 'loggingFilePath';
const gpsFilePathKey = 'gpsFilePath';
const startLatitudeKey = 'startLatitude';
const startLongitudeKey = 'startLongitude';

const dataFrame = 'dataFrame';

export function getDataFilePathKey() {
    return dataFilePathKey;
}
export function getDataFilePathFromObj(obj: Object) {
    return getKeyFromObj(obj, getDataFilePathKey());
}

export function getNewDataFilePathKey() {
    return newDataFilePathKey;
}
export function getNewDataFilePathFromObj(obj: Object) {
    return getKeyFromObj(obj, getNewDataFilePathKey());
}

export function getLoggingFilePathKey() {
    return loggingFilePathKey;
}
export function getLoggingFilePathFromObj(obj: Object) {
    return getKeyFromObj(obj, getLoggingFilePathKey());
}

export function getGPSFilePathKey() {
    return gpsFilePathKey;
}
export function getGPSFilePathFromObj(obj: Object) {
    return getKeyFromObj(obj, getGPSFilePathKey());
}

export function getStartLatitudeKey() {
    return startLatitudeKey;
}
export function getStartLatitudeFromObj(obj: Object) {
    return getKeyFromObj(obj, getStartLatitudeKey());
}

export function getStartLongitudeKey() {
    return startLongitudeKey;
}
export function getStartLongitudeFromObj(obj: Object) {
    return getKeyFromObj(obj, getStartLongitudeKey());
}

export function getDataFrameKey() {
    return dataFrame;
}
export function getDataFrameFromObj(obj: Object) {
    return getKeyFromObj(obj, getDataFrameKey());
}
export function addDataFrameToObj(obj: Object, dataFrame: any) {
    addValToObj(obj, getDataFrameKey(), dataFrame);
}