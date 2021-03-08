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
      margin: "5px",
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

export default function ExportSteps() {

  const classes = useStyles();

  const [activeStep, setActiveStep] = useState(0);
  

  return ( 

    <div className={classes.root}>

        <Stepper
                activeStep={activeStep}
                orientation="vertical"
            >

                {steps.map((label, index) => {

                    return ( 
                        <Step
                            key={label}
                        >   
                            <StepLabel>{getStepLabel(index)}</StepLabel>
                            <StepContent
                                className={classes.step}
                            >
                                {getStepTextContent(index)}
                                <div className={classes.btnContainer}>
                                    <Button
                                        variant="contained"
                                        className={classes.containedBtn}
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    {getStepContent(index)}
                                    <Button
                                        variant="contained"
                                        className={classes.containedBtn}
                                        onClick={handleNext}
                                        disabled={handleNextBtnDisabled(index)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </StepContent>

                        </Step>
                    )
                })}

            </Stepper>
            {activeStep === steps.length && (
                <Paper 
                    square 
                    elevation={0}
                    className={classes.finalPromptContainer}
                >
                    <div className={classes.btnContainer}>
                        <Button 
                            onClick={handleReset}
                            variant="contained"
                            className={classes.containedBtn}
                        >
                            Reselect Files
                        </Button>
                        <Button 
                            onClick={handleUploadStart}
                            variant="contained"
                            className={classes.containedBtn}
                        >
                            Begin upload
                        </Button>
                    </div>
                </Paper>
            )}
    </div>

)



}