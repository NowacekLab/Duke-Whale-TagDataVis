import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import WrapWithDialog from './WrapWithDialog';
import notifsActionsHandler from "../functions/notifs/notifsActionsHandler";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import { useSelector, useDispatch } from 'react-redux';
import FadeNotif from './FadeNotif';

type ListNotificationsProps = {
  show: boolean,
  handleClose: any,
  getList: Function,
}

export default function ListNotifications(props: ListNotificationsProps) {
  const dispatch = useDispatch();
  const notifActionHandler = new notifsActionsHandler(dispatch, "List Notifications");

  //@ts-ignore
  const notif = useSelector(state => state.notif);
  const listNotifs = notifActionHandler.getNotifList(notif);

  const removeNotification = (idx: number) => {
    notifActionHandler.removeNotifFromList(idx);
  }
  return (

    <WrapWithDialog
      showModal={props.show}
      handleClose={props.handleClose}
      handleBack={props.handleClose}
      title={"Notifications"}
    >
      <div
        style={{
            height: "100%",
            minWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "10px",
            overflow: 'hidden'
        }}
      >
        <List
          style={{
            overflowY: 'scroll',
            maxHeight: '500px',
          }}
        >
            {
                listNotifs.map((singleNotifState, idx) => {
                    
                    const status = notifActionHandler.getNotifStatus(singleNotifState);
                    const msg = notifActionHandler.getNotifMsg(singleNotifState);
                    const title = notifActionHandler.getNotifTitle(singleNotifState);

                    return (
                        <ListItem>
                          <FadeNotif 
                            status = {status}
                            title = {title}
                            message = {msg}
                            onCloseNotif = {() => removeNotification(idx)}
                          />
                        </ListItem>


                    )
                })
            }
          </List>

      </div>
    </WrapWithDialog>


  )

}