import {
    uploadProgressObjects,
    uploadProgressObj, 
    uploadInfo,
    GenericUpdateProgress,
    ADD_PROGRESS,
    REMOVE_PROGRESS,
    UPDATE_PROGRESS,
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

    switch (action.type) {
        case ADD_PROGRESS: 
            const progObj = action.payload;
            const objIdx = progObj["index"];

            const newAddState = deepCopyObjectOnlyProps(state);
            const newAddStateProgress = newAddState["progress"];
            newAddStateProgress[objIdx] = progObj;
            return newAddState;
        case REMOVE_PROGRESS:
            const removeIdx = action.payload;

            const newRemState = deepCopyObjectOnlyProps(state);
            const newRemProgState = newRemState["progress"];
            delete newRemProgState[removeIdx];

            return newRemState;
        case UPDATE_PROGRESS: 
            const updateProgObj = action.payload; 

            console.log(updateProgObj);


            const updateIdx = updateProgObj.index;

            console.log(updateIdx);

            const progStep = updateProgObj.progressStep;

            console.log(progStep);

            const newProgStepVal = updateProgObj.newProgress;

            console.log(newProgStepVal);

            const newUpdateState = deepCopyObjectOnlyProps(state);

            console.log(newUpdateState);

            const newProgObj = newUpdateState["progress"][updateIdx];

            console.log(newProgObj);

            const newUploadProgress = newProgObj["progress"];

            console.log(newUploadProgress);

            newUploadProgress[progStep] = newProgStepVal;

            return newUpdateState; 
        case REFRESH_FINISHED:
            const uploadFinishedObjects = action.payload;

            const newFinishState = deepCopyObjectOnlyProps(state);
            newFinishState["finished"] = uploadFinishedObjects;

            return newFinishState;

        default:
            return state; 
    }

}
