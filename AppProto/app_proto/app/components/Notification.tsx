import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Alert from "@material-ui/lab/Alert";
import AlertTitle from '@material-ui/lab/AlertTitle';

const useStyles = makeStyles({
  bannerCont: {
      width: "500px",
      alignItems: "center",
      justifyContent: "center",
      animation: "all 1s ease-in",
      background: "none",
  },
});

type NotificationProps = {
  status: string,
  onCloseNotif: any,
  message: string,
  title: string,
}

export default function Notification(props: NotificationProps) {

  const classes = useStyles();

  return (
    <div className={classes.bannerCont}>
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