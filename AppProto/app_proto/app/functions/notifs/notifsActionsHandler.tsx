import {NotifState, UPDATE_NOTIF_ALL, UPDATE_NOTIF_VISIBILITY} from "./notifsTypes";

export default class notifsActionsHandler {
    
    private dispatch: Function;

    constructor(dispatch: Function) {
        this.dispatch = dispatch; 
    }

    public showSuccessNotif(msg: string) {
        this.handleDispatchAllNotif("success", msg);
    }

    public showErrorNotif(msg: string) {
        this.handleDispatchAllNotif("error", msg);
    }

    private handleDispatchAllNotif(status: string, msg: string) {
        let notifState: NotifState = {
            status: status, 
            msg: msg, 
            visibility: true, 
        }

        this.dispatch({
            type: UPDATE_NOTIF_ALL, 
            payload: notifState
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