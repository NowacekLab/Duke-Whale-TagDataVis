import {
    uploadProgressObjects,
    uploadProgressObj, 
    uploadInfo,
    GenericUpdateProgress,
    ADD_PROGRESS,
    REMOVE_PROGRESS,
    REMOVE_PROGRESSES,
    uploadProgressState,
    REFRESH_FINISHED
} from "./uploadsTypes";
import {getFileInfoPath} from "../paths";
import {deepCopyObjectOnlyProps} from "../object_helpers";

const initialState = {
    progress : {

    },
    finished: {

    }
} as uploadProgressState;

export default function uploadProgressReducer(state = initialState, action: GenericUpdateProgress): uploadProgressState {


    console.log("UPLOAD PROGRESS REDUCER");
    console.log("STATE")
    console.log(state);
    console.log("ACTION")
    console.log(action);

    const newState = deepCopyObjectOnlyProps(state);

    switch (action.type) {
        case ADD_PROGRESS: 
            const progObj = action.payload;
            
            const addUploadInfo = progObj["uploadInfo"];
            const addBatchName = addUploadInfo["batchName"];
            const newAddStateProgress = newState["progress"];
            newAddStateProgress[addBatchName] = addUploadInfo;
            return newState;
        case REMOVE_PROGRESS:
            const remBatchName = action.payload;
            const newRemStateProgress = newState["progress"];
            delete newRemStateProgress[remBatchName];
            return newState;
        case REMOVE_PROGRESSES: 
            const remBatchNames = action.payload;
            const newRemMultStateProgress = newState["progress"];
            remBatchNames.map((batchName) => {  
                if (newRemMultStateProgress.hasOwnProperty(batchName)) {
                    delete newRemMultStateProgress[batchName];
                }
            })
            return newState;
        case REFRESH_FINISHED:
            const uploadFinishedObjects = action.payload;
            newState["finished"] = uploadFinishedObjects;
            return newState;

        default:
            return state; 
    }

}
