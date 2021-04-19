import React, { useEffect } from "react"; 
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import useIsMountedRef from "../functions/useIsMountedRef";
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import FadeNotif from './FadeNotif';

const useStyles = makeStyles({
    bannerSuperCont: {
        zIndex: 999998,
        bottom: 20,
        left: 50,
        right: 0,
        position: "fixed",
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        background: "none"
    },
});

const InitNotification = () => {

    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    const dispatch = useDispatch();
    const notifActionHandler = new notifsActionsHandler(dispatch, "Single Notification");

    //@ts-ignore
    const notif = useSelector(state => state.notif); 
    const msg = notifActionHandler.getSingleNotifMsg(notif);
    const status = notifActionHandler.getSingleNotifStatus(notif);
    const visibility = notifActionHandler.getSingleNotifVisiblity(notif);
    const title = notifActionHandler.getSingleNotifTitle(notif);

    const hideNotification = () => {
        notifActionHandler.hideNotification();
    }
    
    const getMessage = () => {
        if (status === 'error') {
            return msg ?? "An error has occurred."
        } else if (status === 'success') {
            return msg ?? "Successfully executed."
        }
        return "Fatal Error";
    }

    return (
        <div className={classes.bannerSuperCont}>
            {
                visibility && 
                <FadeNotif 
                    status={status}
                    title={title}
                    onCloseNotif={hideNotification}
                    message={getMessage()}
                />  
            }
        </div>
    )

}

export default InitNotification; 