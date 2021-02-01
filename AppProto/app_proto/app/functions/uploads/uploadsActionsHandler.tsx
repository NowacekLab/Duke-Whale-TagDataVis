import {ADD_PROGRESS, REMOVE_PROGRESS,uploadProgressObjects, uploadProgressObj, uploadInfo, uploadArgs, uploadProgress,
        UpdateProgressPayload, UPDATE_PROGRESS, batchInfoArr, uploadFinishedObjects, REFRESH_FINISHED, uploadProgressState} from "./uploadsTypes";
import {uploadFile, loadFinishedUploads} from "./upload";

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

    //@ts-ignore
    public async startUpload(uploadArgs: uploadArgs, uploadInfo: uploadInfo, updateUploadProgress: Function) {
        return await uploadFile(uploadArgs, uploadInfo, updateUploadProgress);
    }

    public updateUploadProgress(idx: number, progStep: string, newProg: string) {
        const updateProgressObj = {} as UpdateProgressPayload;
        updateProgressObj["index"] = idx;
        updateProgressObj["progressStep"] = progStep;
        updateProgressObj["newProgress"] = newProg;
        this.changeUpload(updateProgressObj);
    }   

    public addNewUploadProgress(uploadInfo: uploadInfo, uploadState: any) {
        const newIdx = this.nextOpenIdx(uploadState);
        const uploadProgObj = {} as uploadProgressObj;
        uploadProgObj["index"] = newIdx;
        uploadProgObj["progress"] = defaultUploadProgress;
        uploadProgObj["uploadInfo"] = uploadInfo;
        this.addProgress(uploadProgObj);
    }

    public async refreshAllUploads(uploadState: uploadProgressState) {
        const progressUploads = this.getUploadsProgress(uploadState);
        const finishedUploads = await loadFinishedUploads();

        const finishedUploadBatchNames = function() {
            const batchNamesSet = new Set();
            for (let idx in finishedUploads) {
                const finishedUploadObj = finishedUploads[idx];
                const uploadInfo = finishedUploadObj["uploadInfo"];
                const batchName = uploadInfo["batchName"];
                batchNamesSet.add(batchName);
            }
            return batchNamesSet; 
        }();

        for (let idx in progressUploads) {
            const progUploadObj = progressUploads[idx];
            const obj_index = progUploadObj["index"];
            const progUploadInfo = progUploadObj["uploadInfo"];
            const progBatchName = progUploadInfo["batchName"];
            const progIsFinished = finishedUploadBatchNames.has(progBatchName);
            if (progIsFinished) {
                this.removeProgress(obj_index);
            }
        }

        console.log("FINISHED UPLOADS");
        console.log(finishedUploads);

        this.changeFinished(finishedUploads);
    }

    public addProgress(progressObj: uploadProgressObj) {
        this.dispatch({
            type: ADD_PROGRESS,
            payload: progressObj
        })
    }

    public removeProgress(idx: number) {
        this.dispatch({
            type: REMOVE_PROGRESS,
            payload: idx
        })
    }

    public changeUpload(updateProgressInfo: UpdateProgressPayload) {
        this.dispatch({
            type: UPDATE_PROGRESS,
            payload: updateProgressInfo
        })
    }

    public changeFinished(uploadFinishedObjs: uploadFinishedObjects) {
        this.dispatch({
            type: REFRESH_FINISHED,
            payload: uploadFinishedObjs
        })
    }

    public nextOpenIdx(uploadState: any) {


        const allIdxs = function() {
            const arr = [];
            for (let idx in uploadState) {
                arr.push(Number.isInteger(idx) ? Number(idx) : 0);
            }
            return arr;
        }();
    
        const maxIdx = Math.max(...allIdxs);

        return maxIdx + 1;
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
        const uploadProgressObjs = uploadState["progress"];
        const uploadProgressArr = function(){
            const arr = [];
            for (let idx in uploadProgressObjs) {
                const uploadProgObj = uploadProgressObjs[idx];
                arr.push(uploadProgObj);
            }
            return arr;
        }();

        return uploadProgressArr;
    }

    public getUploadsFinished(uploadState: uploadProgressState) {
        const uploadFinishedObjs = uploadState["finished"];
        const uploadFinishedArr = function(){
            const arr = [];
            for (let idx in uploadFinishedObjs) {
                const uploadFinishObj = uploadFinishedObjs[idx];
                arr.push(uploadFinishObj);
            }
            return arr;
        }();
        return uploadFinishedArr;
    }

}