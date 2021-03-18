import { 
    NotifState,
    SingleNotifState,
    GenericUpdateNotif, 
    UPDATE_NOTIF_ALL,
    UPDATE_NOTIF_VISIBILITY, 
    UPDATE_NOTIF_MSG, 
    UPDATE_NOTIF_STATUS,
    REMOVE_NOTIF_LIST,
    ADD_NOTIF_LIST,} from "./notifsTypes";

const initialSingleNotifState: SingleNotifState = {
    status: "error",
    title: "Generic Error",
    msg: "An error has occurred.",
    visibility: false,
}

const initialListNotifStateStr = localStorage.getItem('listNotif') || '[]';
const initialListNotifState = JSON.parse(initialListNotifStateStr) || [];

console.log("NOTIFS REDUCER STORE");
console.log(initialListNotifStateStr);
console.log(initialListNotifState);

const initialState: NotifState = {
    singleNotif: initialSingleNotifState,
    listNotif: initialListNotifState,
}

export default function notifsReducer(state = initialState, action: GenericUpdateNotif): NotifState {
    switch(action.type) {
        case UPDATE_NOTIF_ALL:
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