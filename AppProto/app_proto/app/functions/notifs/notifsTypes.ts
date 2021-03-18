export interface NotifState {
    [index: string]: any,
    singleNotif: SingleNotifState,
    listNotif: Array<SingleNotifState>,
}

export interface SingleNotifState {
    [index: string]: any,
    status: string, 
    title: string,
    msg: string, 
    visibility: boolean,
}

export type GenericUpdateNotif = RemoveNotifFromList | AddNotifToList | UpdateNotifAll | UpdateNotifStatus | UpdateNotifMsg | UpdateNotifVis; 

// List Notif 
interface RemoveNotifFromList {
    type: typeof REMOVE_NOTIF_LIST,
    payload: number 
}

interface AddNotifToList {
    type: typeof ADD_NOTIF_LIST,
    payload: SingleNotifState, 
}

// Single Notif 
interface UpdateNotifAll {
    type: typeof UPDATE_NOTIF_ALL, 
    payload: SingleNotifState,
}

interface UpdateNotifStatus {
    type: typeof UPDATE_NOTIF_STATUS,
    payload: string, 
}

interface UpdateNotifMsg {
    type: typeof UPDATE_NOTIF_MSG, 
    payload: string,
}

interface UpdateNotifVis {
    type: typeof UPDATE_NOTIF_VISIBILITY,
    payload: boolean,
}

export const ADD_NOTIF_LIST = 'ADD_NOTIF_LIST';
export const REMOVE_NOTIF_LIST = 'REMOVE_NOTIF_LIST';

export const UPDATE_NOTIF_ALL = 'UPDATE_NOTIF_ALL';
export const UPDATE_NOTIF_STATUS = 'UPDATE_NOTIF_STATUS';
export const UPDATE_NOTIF_MSG = 'UPDATE_NOTIF_MSG';
export const UPDATE_NOTIF_VISIBILITY = 'UPDATE_NOTIF_VISIBILITY';