import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
      position: 'relative',
  },
  step: {
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
      paddingRight: "20px"
  },
  cancelBtn: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: "#012069",
      color: "white",
      "&:hover": {
          backgroundColor: "rgba(1,32,105,0.5)"
      }
  },
  uploadBtn: {
      margin: "5px",
      backgroundColor: "#012069",
      color: "white",
      "&:hover": {
          backgroundColor: "rgba(1,32,105,0.5)"
      }
  },
  btnContainer: {
      display: 'flex',
      justifyContent: 'space-around'
  },
  containedBtn: {
      marginLeft: "2px",
      marginRight: "2px",
      fontSize: "12px",
      backgroundColor: "#012069",
      color: "white",
      "&:hover": {
          backgroundColor: "rgba(1,32,105,0.5)"
      }
  },
  finalPromptContainer: {
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: "column"
  }
}))

type GenericStepperProps = {
  steps: Array<string>,
  getStepLabel: Function,
  getStepTextContent: Function,
  getStepContent: Function,
  handleBackBtnDisabled: Function,
  handleNextBtnDisabled: Function,
  getFinalBtns: Function,
}

export default function GenericStepper(props: GenericStepperProps) {

  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0); 
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  return ( 

    <div className={classes.root}>

      <Stepper
              activeStep={activeStep}
              orientation="vertical"
          >

              {props.steps.map((label, index) => {

                  return ( 
                      <Step
                          key={label}
                      >   
                          <StepLabel>{props.getStepLabel(index)}</StepLabel>
                          <StepContent
                              className={classes.step}
                          >
                              <div
                                  style={{
                                      display: "flex",
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      paddingTop: "10px",
                                      paddingBottom: "10px"
                                  }}
                              >
                                  {props.getStepTextContent(index)}
                                  {props.getStepContent(index)}
                              </div>
                              <div className={classes.btnContainer}>
                                  <Button
                                      variant="contained"
                                      className={classes.containedBtn}
                                      disabled={props.handleBackBtnDisabled(props.steps, index)}
                                      onClick={handleBack}
                                  >
                                      Back
                                  </Button>
                                  <Button
                                      variant="contained"
                                      className={classes.containedBtn}
                                      onClick={handleNext}
                                      disabled={props.handleNextBtnDisabled(props.steps, index)}
                                  >
                                      Next
                                  </Button>
                              </div>
                          </StepContent>

                      </Step>
                  )
              })}

        </Stepper>
        {activeStep === props.steps.length && (
            <Paper 
                square 
                elevation={0}
                className={classes.finalPromptContainer}
            > 
              <div
                className={classes.btnContainer}
              >
                {props.getFinalBtns()}
              </div>
            </Paper>
        )}
  </div>

)}