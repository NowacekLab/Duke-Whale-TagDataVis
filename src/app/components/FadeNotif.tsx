import React from 'react';
import Fade from "@material-ui/core/Fade";
import Notification from './Notification';

type FadeNotifProps = {
  status: string,
  onCloseNotif: any,
  title: string,
  message: string,
}

export default function FadeNotif(props: FadeNotifProps) {

  return (
    <div className="alertContainer">
        {
            <Fade in={props.status==="error" || props.status === "success"} timeout={500}>
                <Notification 
                  status={props.status}
                  title={props.title}
                  onCloseNotif={props.onCloseNotif}
                  message={props.message}
                />
            </Fade>
        }
    </div>
  )

}