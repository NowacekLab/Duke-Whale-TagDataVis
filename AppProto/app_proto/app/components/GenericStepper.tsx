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
  btnContainer: {
      display: 'flex',
      justifyContent: 'space-around'
  },
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
                              className="flex-col-center"
                              style={{
                                  paddingRight: "20px",
                              }}
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
                                      id="color-themed"
                                      className="containedBtn"
                                      disabled={props.handleBackBtnDisabled(props.steps, index)}
                                      onClick={handleBack}
                                  >
                                      Back
                                  </Button>
                                  <Button
                                      variant="contained"
                                      id="color-themed"
                                      className="containedBtn"
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
                className="flex-col-center"
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