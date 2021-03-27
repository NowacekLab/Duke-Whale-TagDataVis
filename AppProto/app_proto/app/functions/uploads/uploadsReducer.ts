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

    switch (action.type) {
        case ADD_PROGRESS: 
            const progObj = action.payload;
            const addUploadInfo = progObj["uploadInfo"];
            const addBatchName = addUploadInfo["batchName"];

            if (!addBatchName) return state;

            return {
                ...state,
                progress: {
                    ...state["progress"],
                    [addBatchName]: progObj
                }
            };
        case REMOVE_PROGRESS:
            let newProgState1 = deepCopyObjectOnlyProps(state["progress"]);
            const remBatchName = action.payload;
            delete newProgState1[remBatchName];
            return {
                ...state,
                progress: {
                    ...newProgState1
                }
            };
        case REMOVE_PROGRESSES: 
            let newProgState2 = deepCopyObjectOnlyProps(state["progress"]);
            const remBatchNames = action.payload;
            remBatchNames.map((batchName) => {  
                if (newProgState2.hasOwnProperty(batchName)) {
                    delete newProgState2[batchName];
                }
            })
            return {
                ...state,
                progress: {
                    ...newProgState2
                }
            };
        case REFRESH_FINISHED:
            const uploadFinishedObjects = action.payload;
            return {
                ...state,
                finished: uploadFinishedObjects
            };

        default:
            return state; 
    }

}
