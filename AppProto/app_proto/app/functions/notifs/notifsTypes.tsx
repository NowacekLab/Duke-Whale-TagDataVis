export interface NotifState {
    status: string, 
    msg: string, 
    visibility: boolean,
}

export type GenericUpdateNotif = UpdateNotifAll | UpdateNotifStatus | UpdateNotifMsg | UpdateNotifVis; 

interface UpdateNotifAll {
    type: typeof UPDATE_NOTIF_ALL, 
    payload: NotifState,
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

export const UPDATE_NOTIF_ALL = 'UPDATE_NOTIF_ALL';
export const UPDATE_NOTIF_STATUS = 'UPDATE_NOTIF_STATUS';
export const UPDATE_NOTIF_MSG = 'UPDATE_NOTIF_MSG';
export const UPDATE_NOTIF_VISIBILITY = 'UPDATE_NOTIF_VISIBILITY';