import {ForceLoadState, 
    GenericForceLoadAction,
    UPDATE_FORCE_LOAD} from "./forceLoadTypes";

const initialState: ForceLoadState = {
    shouldForceLoad: false,
}

export default function forceLoadReducer(state = initialState, action: GenericForceLoadAction) {
    // switch(action.type) 
    switch (action.type) {
        case UPDATE_FORCE_LOAD: 
            return {
                ...state, 
                shouldForceLoad: action.payload,
            }
        default: 
            return state;
    }
}