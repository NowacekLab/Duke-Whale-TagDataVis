import {handleProcessFile} from "./process";

export type uploadFileCMDLineArgs = {
    dataFilePath: string, 
    newDataFilePath: string,
    loggingFilePath: string, 
    logFilePath: string,
    gpsFilePath: string, 
    startLatitude: string, 
    startLongitude: string, 
}
export async function uploadFile(uploadFileArgs: uploadFileCMDLineArgs) {

    try {
        const {success, response} = await handleProcessFile(uploadFileArgs);
        if (!success) {
            throw Error(response);
        }
        

    } catch (error) {
        return {
            success: false,
            response: error,
        }
    }

}