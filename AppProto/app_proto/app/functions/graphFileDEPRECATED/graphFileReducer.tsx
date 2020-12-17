import {GraphFileState, GenericGraphFileAction, ChangeChosenFile} from "./graphFileTypes";

const initialState: GraphFileState = {
    chosenFile: "",
}

export default function graphFileReducer(state = initialState, action: GenericGraphFileAction) {
    switch (action.type) {
        case (ChangeChosenFile):
            return {
                ...state,
                chosenFile: action.payload
            }
        default: 
            return state;
    }
}