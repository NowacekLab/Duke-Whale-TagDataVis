import React, {useState, useEffect} from 'react';
import Fab from '@material-ui/core/Fab';
import NotificationsIcon from '@material-ui/icons/Notifications'; 
import ListNotifications from './ListNotifications';
import { useSelector, useDispatch } from 'react-redux';
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import List from "@material-ui/core/List";

export default function NotifBtn() {

    const [showNotifs, setShowNotifs] = useState(false);
    const handleCloseNotifs = () => {
      setShowNotifs(false);
    } 
    const handleOpenNotifs = () => {
      console.log("hello");
      console.log(showNotifs);
      setShowNotifs(true);
    }

    const dispatch = useDispatch();
    const notifActionHandler = new notifsActionsHandler(dispatch, "Notification Button");
  
    //@ts-ignore
    const notif = useSelector(state => state.notif);
    const listNotifs = notifActionHandler.getNotifList(notif);

    const notifsToShow = listNotifs && listNotifs.length > 0;
  
    const removeNotification = (idx: number) => {
      notifActionHandler.removeNotifFromList(idx);
    }

    const rawNumNotifs = listNotifs.length ?? 0;
    const numNotifs = rawNumNotifs > 99 ? "99+" : `${rawNumNotifs}`;

    function getListNotifs() {
  
      return (
  
          <List>
            {
                listNotifs.map((singleNotifState, idx) => {

                    console.log("List Notifs map");
                    console.log(singleNotifState);
                    
                    const status = notifActionHandler.getNotifStatus(singleNotifState);
                    const msg = notifActionHandler.getNotifMsg(singleNotifState);

                    console.log(status);
                    console.log(msg);

                    return (

                        <div></div>

                    )
                })
            }
          </List>

      )
    
    }

    return ( 
      <>

        <Fab 
          size="small" 
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
          }} 
          id="color-themed"
          className="btn"
          onClick={handleOpenNotifs}>
            <div style={{
                position: "relative"}}
            >
                <NotificationsIcon />

                {
                  notifsToShow && 
                  <div
                    style={{
                        borderRadius: "50%",
                        position: "absolute",
                        top: 1,
                        right: 1,
                        backgroundColor: "red",
                        height: "5px",
                        width: "5px",
                        fontSize: "12px"
                    }}
                  />
                }
            </div>
        </Fab>

        <ListNotifications 
          show={showNotifs}
          handleClose={handleCloseNotifs}
          getList={getListNotifs}
        />

      </>
    )

}