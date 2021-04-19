import React from 'react';
import Alert from "@material-ui/lab/Alert";
import AlertTitle from '@material-ui/lab/AlertTitle';

type NotificationProps = {
  status: string,
  onCloseNotif: any,
  message: string,
  title: string,
}

export default function Notification(props: NotificationProps) {

  return (
    <div className="alertContainer">
        {
            props.status === "error" &&
            <Alert severity="error" onClose={props.onCloseNotif}> 
                <AlertTitle>
                  {props.title}
                </AlertTitle>
                {props.message}
            </Alert>
        }
        {
            props.status === "success" &&
            <Alert severity="success" onClose={props.onCloseNotif}>
              <AlertTitle>
                {props.title}
              </AlertTitle>
                {props.message}
            </Alert>
        }
    </div>
  )

}