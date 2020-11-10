import React from "react";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'; 

import Button from "@material-ui/core/Button";

const Confirmation = props => {

    return (
        <Dialog
        open={props.open ?? false}
        onClose={props.close ?? function fail(){return}}
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
          {props.title ?? null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.desc ?? null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.reject ?? function fail(){return}} color="primary">
            Cancel
          </Button>
          <Button onClick={props.confirm ?? function fail(){return}} color="primary">
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default Confirmation; 