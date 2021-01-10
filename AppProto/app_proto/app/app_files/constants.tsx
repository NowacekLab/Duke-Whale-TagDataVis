export const DATA_FILE_NAME_KEY = "dataFileName"; 
export const DATA_FILE_PATH_KEY = "dataFilePath"; 
export const LOG_FILE_NAME_KEY = "logFileName";
export const LOG_FILE_PATH_KEY = 'logFilePath';
export const GPS_FILE_NAME_KEY = "gpsFileName";
export const GPS_FILE_PATH_KEY = "gpsFilePath";
export const START_LAT_KEY = 'startLat';
export const START_LONG_KEY = 'startLong';

export type uploadInfoObject = {
    "dataFileName": string, 
    "dataFilePath": string, 
    "logFileName": string,
    "logFilePath": string, 
    "gpsFileName": string,
    "gpsFilePath": string, 
    "startLat": string, 
    "startLong": string, 
}