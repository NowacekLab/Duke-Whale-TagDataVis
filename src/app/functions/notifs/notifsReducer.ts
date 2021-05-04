import { 
    NotifState,
    SingleNotifState,
    GenericUpdateNotif, 
    UPDATE_NOTIF_ALL,
    UPDATE_NOTIF_VISIBILITY, 
    UPDATE_NOTIF_MSG, 
    UPDATE_NOTIF_STATUS,
    REMOVE_NOTIF_LIST,
    UPDATE_NOTIF_STATE,
    ADD_NOTIF_LIST,} from "./notifsTypes";

export const initialSingleNotifState: SingleNotifState = {
    status: "error",
    title: "Generic Error",
    msg: "An error has occurred.",
    visibility: false,
}

const initialListNotifStateStr = localStorage.getItem('listNotif') || '[]';
const initialListNotifState = function() {
    try {
        return JSON.parse(initialListNotifStateStr) || [];
    } catch (error) {
        console.log(error);
        localStorage.setItem('listNotif', JSON.stringify([]));
        return [];
    }
}();

const initialState: NotifState = {
    singleNotif: initialSingleNotifState,
    listNotif: initialListNotifState,
}

export default function notifsReducer(state = initialState, action: GenericUpdateNotif): NotifState {
    switch(action.type) {
        case UPDATE_NOTIF_STATE:
            return { 
                ...state,
                ...action.payload
            }
        case UPDATE_NOTIF_ALL:

            let newListNotif = action.payload.listNotif ?? [];
            localStorage.setItem('listNotif', JSON.stringify(newListNotif));

            return {
                ...state, 
                singleNotif: {
                    ...state.singleNotif,
                    ...action.payload
                }
            } 
        case REMOVE_NOTIF_LIST:
            let remIdx = action.payload;

            let remNewList = state.listNotif.filter((val, idx) => idx != remIdx);

            localStorage.setItem('listNotif', JSON.stringify(remNewList));
            
            return {
                ...state,
                listNotif: remNewList,
            }
        case ADD_NOTIF_LIST:
            let newSingleState = action.payload;
            let addNewList = [...state.listNotif, newSingleState];

            localStorage.setItem('listNotif', JSON.stringify(addNewList));

            return {
                ...state,
                listNotif: addNewList,
            }
        case UPDATE_NOTIF_VISIBILITY:
            return {
                ...state,
                singleNotif: {
                    ...state.singleNotif,
                    visibility: action.payload,
                }
            }
        case UPDATE_NOTIF_MSG: 
            return {
                ...state, 
                singleNotif: {
                    ...state.singleNotif,
                    msg: action.payload,
                }
            }
        case UPDATE_NOTIF_STATUS: 
            return {
                ...state, 
                singleNotif: {
                    ...state.singleNotif,
                    status: action.payload,
                }
            }
        default: 
            return state;
    }
}