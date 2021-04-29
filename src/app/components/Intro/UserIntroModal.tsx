import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        gap: "20px",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        color: "white",
        backgroundColor: "white",
    }, 
    paper: {
        backgroundColor: "white",
        width: "50%",
        height: "50%"
    },
    paperTitle: {
        fontSize: "2em",
        fontWeight: "bold",
        margin: 0,
        color: "black"
    },
})

export default function UserIntroModal() {

    const classes = useStyles();

    const dispatch = useDispatch();

    const handlePaperClose = () => {
        setShowPaper(false);
    }
    const handleEnterApp = () => {
        introHandler.setNotUserFirstVisit();
        handlePaperClose();
    }

    const [activeStep, setActiveStep] = useState(0);
    const handleNextStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBackStep = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    const handleReset = () => {
        setActiveStep(0);
    }

    const steps = function getSteps() {
        return [
            'Upload File Batches',
            'View Premade Graphs',
            'Edit And Create Graphs',
            'Export Graphs',
            'Final Notes'
        ]
    }();

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return `Upload a combination of files as a 'batch' 
                        for automatic processing and graph generation.`;
            case 1:
                return `See and interact with all of your graphs in
                        the graph view on the left hand side.`;
            case 2: 
                return `Edit and create new graphs in the fully-fledged
                        chart editor using processed data.`;
            case 3:
                return `Export graphs as fully self-contained HTML files
                        that can be viewed outside of the app and even
                        generate videos of 3D visualizations.`;
            case 4:
                return `We hope you enjoy! For any serious technical
                        difficulties please contact Dr. Nowacek at
                        Duke University.`;
            default:
                return 'Unknown step';
        }
    }

    return (
            <Container
                className={classes.root}
                style = {{
                    display: showPaper ? "" : "none"
                }}
            >

                <Fade
                    in={true}
                    timeout={2000}
                >
                    <h1
                        className={classes.paperTitle}
                    > 
                        Welcome To Whale
                    </h1>
                </Fade>

                <Fade
                    in={true}
                    timeout={2000}
                >
                    <Paper
                        elevation={3}
                        className={classes.paper}
                    >
                        <Stepper
                            activeStep={activeStep}
                            orientation="vertical"
                        >
                            {
                                steps.map((label, index) => {

                                    return (

                                        <Step
                                            key={label}
                                        >
                                            <StepLabel>
                                                {label}
                                            </StepLabel>

                                            <StepContent>
                                                <Typography>
                                                    {getStepContent(index)}
                                                </Typography>

                                                <div>
                                                    <div>
                                                        <Button
                                                            disabled={activeStep === 0}
                                                            onClick={handleBackStep}
                                                        >
                                                            Back
                                                        </Button>

                                                        <Button
                                                            onClick={handleNextStep}
                                                        >
                                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                        </Button>
                                                    </div>
                                                </div>

                                            </StepContent>

                                        </Step>


                                    )

                                })
                            }

                        </Stepper>
                        
                        {
                            activeStep === steps.length && (
                                <Paper
                                    square
                                    elevation={0}
                                >

                                    <div>

                                        <Button
                                            onClick={handleReset}
                                        >
                                            See Again
                                        </Button>

                                        <Button
                                            onClick={handleEnterApp}
                                        >
                                            Enter App 
                                        </Button>

                                    </div>

                                </Paper>
                            )
                        }

                    </Paper>
                </Fade>

            </Container>

    )

}
