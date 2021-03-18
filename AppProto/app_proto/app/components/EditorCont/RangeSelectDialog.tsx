import React, { useState } from "react";
import {makeStyles} from '@material-ui/core/styles';
import WrapWithDialog from "../WrapWithDialog";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    outline: "none",
    maxHeight: "80%",
    padding: "10px",
  },
  rangeFieldCont: {
    display: "flex",
    gap: "10px",
    outline: "none",
    padding: "20px"
  },
  btn: {
      backgroundColor: "#012069",
      color: "white",
      "&:hover": {
          backgroundColor: "#012069",
          opacity: 0.8
      }
  }
})

type RangeSelectDialogProps = {
  showModal: boolean,
  handleClose: any,
  handleBack: Function,
  onRangeConfirm: Function,
  currInputMinRange: string,
  currInputMaxRange: string,
}

export default function RangeSelectDialog(props: RangeSelectDialogProps) {

  const classes = useStyles();

  const [inputMinRange, setInputMinRange] = useState(props.currInputMinRange);
  const [inputMaxRange, setInputMaxRange] = useState(props.currInputMinRange);
  const onInputMinRange = (event: any) => {
      const newInputMin = event && event.target && event.target.value ? event.target.value : "";
      setInputMinRange(newInputMin);
  }
  const onInputMaxRange = (event: any) => {
      const newInputMax = event && event.target && event.target.value ? event.target.value : "";
      setInputMaxRange(newInputMax);
  }

  return (
      <WrapWithDialog
        showModal={props.showModal}
        handleClose={props.handleClose}
        handleBack={props.handleBack}
        title={"Range Input"}
      >
        
        <div
          className={classes.wrapper}
        >

          <div
            style={{
              display: 'flex',
              gap: '5px'
            }}
          >
            {
                Number.isInteger(Number.parseInt(inputMinRange)) &&
                Number.parseInt(inputMinRange) >= 0 

                ?

                <TextField 
                    label="Minimum"
                    value={inputMinRange}
                    onChange={onInputMinRange}
                />

                :

                <TextField
                    error
                    value={inputMinRange}
                    label="Error Minimum"
                    helperText="Must be an integer > 0"
                    onChange={onInputMinRange}
                />
            }

            {
                Number.isInteger(Number.parseInt(inputMaxRange)) 

                ?

                <TextField 
                    label="Maximum"
                    value={inputMaxRange}
                    onChange={onInputMaxRange}
                />

                :

                <TextField 
                    error
                    value={inputMaxRange}
                    onChange={onInputMaxRange}
                    label="Error Maximum"
                    helperText="Must be an integer"
                />

            }
          </div>


          {
            Number.isInteger(Number.parseInt(inputMinRange)) &&
            Number.parseInt(inputMinRange) >= 0 &&
            Number.isInteger(Number.parseInt(inputMaxRange)) &&

            <Button
                className={classes.btn}
                onClick={() => props.onRangeConfirm(inputMinRange, inputMaxRange)}
                variant="outlined"
            >
                {`Confirm Range?`}
            </Button>
          }

        </div>

      </WrapWithDialog>
  )
}