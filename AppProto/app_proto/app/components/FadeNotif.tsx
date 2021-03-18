import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Fade from "@material-ui/core/Fade";
import Notification from './Notification';

const useStyles = makeStyles({
  bannerCont: {
      width: "500px",
      alignItems: "center",
      justifyContent: "center",
      animation: "all 1s ease-in",
      background: "none",
      position: "relative"
  },
});

type FadeNotifProps = {
  status: string,
  onCloseNotif: any,
  title: string,
  message: string,
}

export default function FadeNotif(props: FadeNotifProps) {

  const classes = useStyles();

  return (
    <div className={classes.bannerCont}>
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