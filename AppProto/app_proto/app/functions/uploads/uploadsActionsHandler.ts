import {ADD_PROGRESS, REMOVE_PROGRESS,uploadProgressObjects, uploadProgressObj, uploadInfo, uploadProgress,
        UpdateProgressPayload, REMOVE_PROGRESSES, uploadFinishedObjects, REFRESH_FINISHED, uploadProgressState} from "./uploadsTypes";
import {uploadFile, loadFinishedUploads} from "./upload";
import {fileNameFromPath, getBatchSaveDir} from "../paths";
import {removeDirAndFiles, removeFromFileInfo} from "../files";
import { failResponse, successResponse, throwErrIfFail } from "../responses";

export const defaultUploadProgress: uploadProgress = {
    processing: "process",
    generating: "process",
    saving: "process"
}

export default class uploadsActionsHandler {

    private dispatch: Function;

    constructor(dispatch: any) { 
        this.dispatch = dispatch;
    }

    
    public getUploadStatusDesc(uploadProgress: uploadProgress) {
        /**
         * Single upload status based on upload progress object
         * Only expects process or fail steps
         * B/c it contains a method for filtering
         * finished and unfinished uploads that is used in components
         */

        function getLongerStepDesc(stepName: string) {
            switch (stepName) {
                case "processing":
                    return "processing given data file"
                case "generating":
                    return "generating graphs"
                case "saving":
                    return "saving all files"
            }
        }
        function failMsg(stepName: string) {
            const longerDesc = getLongerStepDesc(stepName);
            return `Failed at ${longerDesc}`;
        }
        function progMsg(stepName: string) {
            const longerDesc = getLongerStepDesc(stepName);
            return `Currently ${longerDesc}`;
        }

        let singleStatus;

        for (let uploadStep in uploadProgress) {
            const status = uploadProgress[uploadStep];
            if (status === "fail") {
                singleStatus = failMsg(uploadStep);
                break;
            } else if (status === "progress") {
                singleStatus = progMsg(uploadStep);
                break;
            } 
        }

        return singleStatus;
    }

    private getUploadInfoArr(uploadInfo: uploadInfo) {
        const uploadInfoArr = [
            {
                title: "Data File Name",
                info: fileNameFromPath(uploadInfo["dataFilePath"])
            },
            {   
                title: "Starting Date",
                info: `Date: ${uploadInfo['startingDate']}`
            },
            {
                title: "GPS File Name",
                info: fileNameFromPath(uploadInfo["gpsFilePath"])
            },
            {
                title: "Starting Latitude and Longitude",
                info: `Lat (${uploadInfo["startLatitude"]}), Long (${uploadInfo["startLongitude"]})`
            }
        ];

        return uploadInfoArr;
    }

    //@ts-ignore
    public async startUpload(uploadInfo: uploadInfo) {
        return await uploadFile(uploadInfo);
    }

    public async deleteProgressUploadFiles(uploadInfo: uploadInfo) {
        if (!uploadInfo.hasOwnProperty('batchName')) return;
        const batchName = uploadInfo['batchName']; 
        const dirPath = await getBatchSaveDir(batchName);
        await removeDirAndFiles(dirPath);
        await removeFromFileInfo(batchName);
    }

    public async deleteFinishedUpload(batchName: string) {
        try {
            const dirPath = await getBatchSaveDir(batchName);
            const removeDirRes = await removeDirAndFiles(dirPath);
            throwErrIfFail(removeDirRes);
            const remFileInfo = await removeFromFileInfo(batchName);
            throwErrIfFail(remFileInfo);

            return successResponse();
        } catch {
            return failResponse();
        }
    }

    public removeNewUploadProgress(uploadInfo: uploadInfo) {
        if (!uploadInfo.hasOwnProperty('batchName')) return;
        const batchName = uploadInfo['batchName'];
        this.removeProgress(batchName);
    }

    public addNewUploadProgress(uploadInfo: uploadInfo) {

        console.log("ADD NEW UPLOAD PROGFRESS");
        console.log(uploadInfo);

        const uploadProgObj = {} as uploadProgressObj;
        const uploadInfoArr = this.getUploadInfoArr(uploadInfo);

        uploadProgObj["uploadInfo"] = uploadInfo;
        uploadProgObj["uploadInfoArr"] = uploadInfoArr;
        this.addProgress(uploadProgObj);
    }

    public async refreshAllUploads() {

        console.log("REFRESH ALL UPLOADS");

        const finishedUploads = await loadFinishedUploads();

        console.log(finishedUploads);

        const finishedUploadBatchNames = function() {
            let batchNamesArr = Object.keys(finishedUploads);
            batchNamesArr = batchNamesArr ? batchNamesArr : [];
            return batchNamesArr;
        }();

        console.log(finishedUploadBatchNames);

        this.removeProgresses(finishedUploadBatchNames);
        this.changeFinished(finishedUploads);
    }

    public addProgress(progressObj: uploadProgressObj) {
        this.dispatch({
            type: ADD_PROGRESS,
            payload: progressObj
        })
    }

    public removeProgresses(batchNames: Array<string>) {
        this.dispatch({
            type: REMOVE_PROGRESSES,
            payload: batchNames
        })
    }

    public removeProgress(batchName: string) {
        this.dispatch({
            type: REMOVE_PROGRESS,
            payload: batchName
        })
    }

    public changeFinished(uploadFinishedObjs: uploadFinishedObjects) {
        this.dispatch({
            type: REFRESH_FINISHED,
            payload: uploadFinishedObjs
        })
    }

    public getUploadInfoByIdx(idx: number, uploadState: any) {
        const uploadProg = this.getUploadProg(idx, uploadState);
        return this.getUploadInfo(uploadProg);
    }

    public getUploadInfo(uploadProg: any) {
        return uploadProg["uploadInfo"];
    }

    public getUploadProg(idx: any, uploadState: any) {
        return uploadState[idx];
    }

    public getUploadsProgress(uploadState: uploadProgressState) {
        const uploadProgress = uploadState ? uploadState["progress"] : [];
        return uploadProgress;
    }

    public getUploadsFinished(uploadState: uploadProgressState) {
        const uploadFinished = uploadState ? uploadState['finished'] : [];
        return uploadFinished;
    }

}