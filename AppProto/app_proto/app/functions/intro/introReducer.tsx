import { null } from "mathjs";
import { IntroState, GenericUpdateNotif, SET_NOT_FIRST, USER_FIRST_TIME_KEY} from "./introTypes";

const initialState: IntroState = {
    first: localStorage.getItem(USER_FIRST_TIME_KEY) === null
}

export default function notifsReducer(state = initialState, action: GenericUpdateNotif): IntroState {
    switch(action.type) {
        case SET_NOT_FIRST: 
            const first = action.payload['first'];

            return {
                ...state, 
                first: first 
            }
        default: 
            return state;
    }
}