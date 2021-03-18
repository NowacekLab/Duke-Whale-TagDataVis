import {NotifState, SingleNotifState, UPDATE_NOTIF_ALL, UPDATE_NOTIF_VISIBILITY, ADD_NOTIF_LIST, REMOVE_NOTIF_LIST} from "./notifsTypes";

export default class notifsActionsHandler {
    
    private dispatch: Function;
    private component: string;

    constructor(dispatch: Function, component: string) {
        this.dispatch = dispatch; 
        this.component = component;
    }

    public getSingleNotifStatus(notifState: NotifState) {
        return this.getAttrFromSingleNotifState(notifState, 'status');
    }

    public getSingleNotifMsg(notifState: NotifState) {
        return this.getAttrFromSingleNotifState(notifState, 'msg');
    }

    public getSingleNotifVisiblity(notifState: NotifState) {
        return this.getAttrFromSingleNotifState(notifState, 'visibility');
    }

    public getSingleNotifTitle(notifState: NotifState) {
        return this.getAttrFromSingleNotifState(notifState, 'title');
    }

    private getAttrFromSingleNotifState(notifState: NotifState, attr: string) {
        const singleNotifState = notifState.singleNotif;
        return singleNotifState.hasOwnProperty(attr) ? singleNotifState[attr] : null;
    }

    public getNotifStatus(singleNotif: SingleNotifState) {
        return singleNotif.status;
    }

    public getNotifMsg(singleNotif: SingleNotifState) {
        return singleNotif.msg;
    }

    public getNotifTitle(singleNotif: SingleNotifState) {
        return singleNotif.title;
    }

    public getNotifList(notifState: NotifState) {
        const listNotifState = notifState.listNotif;
        return listNotifState;
    }

    public showSuccessNotif(msg: string) {
        this.handleDispatchAllNotif("success", msg);
    }

    public showErrorNotif(msg: string) {
        this.handleDispatchAllNotif("error", msg);
    }

    private handleDispatchAllNotif(status: string, msg: string) {

        this.handleDispatchAddListNotif(status, msg);

        let singleNotifState: SingleNotifState = {
            status: status, 
            title: this.component,
            msg: msg, 
            visibility: true, 
        }

        this.dispatch({
            type: UPDATE_NOTIF_ALL, 
            payload: singleNotifState
        })
    }

    public addNotifToList(status: string, msg: string) {
        this.handleDispatchAddListNotif(status, msg);
    }

    private handleDispatchAddListNotif(status: string, msg: string) {
        const currDate = new Date().toLocaleString();

        let singleNotifState: SingleNotifState = {
            status: status,
            title: `${this.component}: ${currDate}`,
            msg: msg,
            visibility: true 
        }

        this.dispatch({
            type: ADD_NOTIF_LIST,
            payload: singleNotifState
        })
    }

    public removeNotifFromList(idx: number) {
        this.handleDispatchRemoveListNotif(idx);
    }

    private handleDispatchRemoveListNotif(idx: number) {
        this.dispatch({
            type: REMOVE_NOTIF_LIST,
            payload: idx 
        })
    }

    public hideNotification() {
        this.handleNotifVisibility(false);
    }

    public showNotification() {
        this.handleNotifVisibility(true);
    }

    private handleNotifVisibility(visibility: boolean) {
        this.dispatch({
            type: UPDATE_NOTIF_VISIBILITY, 
            payload: visibility,
        })
    }

}