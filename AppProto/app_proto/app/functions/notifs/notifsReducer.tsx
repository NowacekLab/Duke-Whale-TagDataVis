import { 
    NotifState,
    GenericUpdateNotif, 
    UPDATE_NOTIF_ALL,
    UPDATE_NOTIF_VISIBILITY, 
    UPDATE_NOTIF_MSG, 
    UPDATE_NOTIF_STATUS } from "./notifsTypes";

const initialState: NotifState = {
    status: "error",
    msg: "An error has occurred.",
    visibility: false,
}

export default function notifsReducer(state = initialState, action: GenericUpdateNotif): NotifState {
    switch(action.type) {
        case UPDATE_NOTIF_ALL: 
            return {
                ...state, 
                ...action.payload,
            }
        case UPDATE_NOTIF_VISIBILITY:
            return {
                ...state,
                visibility: action.payload,
            }
        case UPDATE_NOTIF_MSG: 
            return {
                ...state, 
                msg: action.payload,
            }
        case UPDATE_NOTIF_STATUS: 
            return {
                ...state, 
                status: action.payload,
            }
        default: 
            return state;
    }
}