import React from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'; 
import Button from "@material-ui/core/Button";

type ConfirmationProps = {
  open: boolean,
  close: callBack, 
  title: string, 
  desc: string, 
  reject: callBack, 
  confirm: callBack,
}

const Confirmation = ({open, close, title, desc, reject, confirm}: ConfirmationProps) => {

    return (
        <Dialog
        open={open}
        onClose={close}
        style={{
          color: "#012069",
          position: "absolute",
          left: 200
        }}
        BackdropProps={{
          style: {
            left: 200
          }
        }}
      >
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={reject} color="primary">
            Cancel
          </Button>
          <Button onClick={confirm} color="primary">
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default Confirmation; 