import React, {useState, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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

type UploadDialogCompProps = {
    setUploadInfoObject: Function, 
    beginProcessing: Function,
}

export default function UploadDialogComp({setUploadInfoObject, beginProcessing} : UploadDialogCompProps) {

    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    const handleReset = () => {
        setActiveStep(0);
        resetFileObjs();
    }

    type uploadFileObj = {
        name: string,
        path: string
    }
    const defaultFileObj = {
        name: "",
        path: ""
    }
    const uploadDataFileRef = useRef(null);
    const [uploadDataFileObj, setUploadDataFileObj] = useState<uploadFileObj>(defaultFileObj);
    const uploadLogFileRef = useRef(null);
    const [uploadLogFileObj, setUploadLogFileObj] = useState<uploadFileObj>(defaultFileObj);
    const uploadGPSFileRef = useRef(null);
    const [uploadGPSFileObj, setUploadGPSFileObj] = useState<uploadFileObj>(defaultFileObj);
    const uploadFileObjects = [uploadDataFileObj, uploadLogFileObj, uploadGPSFileObj];
    const uploadFileObjectSetters = [setUploadDataFileObj, setUploadLogFileObj, setUploadGPSFileObj];

    const uploadDataFileEndingsArr = [".csv", ".mat"];
    const uploadDataFileEndings = uploadDataFileEndingsArr.join(",");
    const uploadLogFileEndingsArr = [".txt", ".xml"];
    const uploadLogFileEndings = uploadLogFileEndingsArr.join(",");

    // pulled from pandas website (python file uses pandas.read_csv)
    const uploadGPSFileEndingsArr = [".xls", ".xlsx", ".xlsm", '.xlsb', '.odf', '.ods', '.odt'];
    const uploadGPSFileEndings = uploadGPSFileEndingsArr.join(",");
    const uploadFileEndings = [uploadDataFileEndings, uploadLogFileEndings, uploadGPSFileEndings];

    const resetFileObjs = () => {
        setUploadDataFileObj(defaultFileObj);
        setUploadLogFileObj(defaultFileObj);
        setUploadGPSFileObj(defaultFileObj);
    }


    const uploadFileRefs = [uploadDataFileRef, uploadLogFileRef, uploadGPSFileRef];

    const handleUploadBtnClick = (index: number) => {

        const ref = uploadFileRefs[index];
        clickRef(ref);
    }
    const clickRef = (ref: any) => {
        ref && ref.current ? ref.current.click() : null;
    }
    const handleRefClick = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        //@ts-ignore 
        const file_path = e.target.files && e.target.files[0].path;
        const file_name = e.target.files && e.target.files[0].name; 
        e.target.value = "";

        const file_obj = {
            "name": file_name || "",
            "path": file_path || "",
        }

        const uploadFileObjectSetter = uploadFileObjectSetters[index];

        if (file_name && file_name !== "") {
            uploadFileObjectSetter(file_obj);
        }
    }

    function getStepContent(index: number) {

        if (isFileRequired(index)) {
            return (
                <Typography>
                    This file is <b>required</b>
                </Typography>
            )
        } else {
            return (
                <Typography>
                    This file is <b>optional</b>
                </Typography>
            )
        }
    }

    function handleNextBtnDisabled(index: number): boolean {
        return shouldDisableNextBtn(index);
    }

    function shouldDisableNextBtn(index: number): boolean {
        if (!isFileRequired(index)) return false;
        return !isFileUploaded(index);
    }

    function isFileUploaded(index: number): boolean {
        const fileObj = getFileObj(index);

        if (fileObj && fileObj.name && fileObj.name !== "" && fileObj.path && fileObj.path !== "") {

            return true;
        }
        return false; 
    }

    function isFileRequired(index: number) {
        const isGraphFile = index === 2; 
        return !isGraphFile;
    }

    const steps = ['Upload the data file', 'Upload the log file', 'Upload the GPS file'];
    function getStepLabel(index: number) {
        const uploadText = steps[index];
        const placeholder = "No file uploaded";

        return `${uploadText} [${getFileNameOrDefault(index, placeholder)}]`
    }

    function getFileNameOrDefault(index: number, placeholder: string) {
        if (isFileUploaded(index)) {
            const fileObj = getFileObj(index);
            return fileObj.name;
        }
        return placeholder;
    }

    function getFileObj(index: number) {
        return uploadFileObjects[index];
    }

    // const handleCancel = () => {
    //     resetFileObjs();
    //     beginProcessing(false);
    // }

    const handleUploadStart = () => {
        const uploadInfoObj = {
            "dataFileName": uploadDataFileObj.name, 
            "dataFilePath": uploadDataFileObj.path, 
            "logFileName": uploadLogFileObj.name,
            "logFilePath": uploadLogFileObj.path, 
            "gpsFileName": uploadGPSFileObj.name,
            "gpsFilePath": uploadGPSFileObj.path, 
        }
        setUploadInfoObject(uploadInfoObj);
        beginProcessing(true);
    }

    return ( 

        <div className={classes.root}>

            {uploadFileRefs.map((ref, index) => {

                return (
                    <input type="file" id="file-upload" ref={ref} style={{display: "none"}} onChange={(e) => {handleRefClick(e, index)}} accept={uploadFileEndings[index]}/>
                )
            
            })}

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
                                    {getStepContent(index)}
                                    <div className={classes.btnContainer}>
                                        <Button
                                            variant="contained"
                                            className={classes.containedBtn}
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className={classes.containedBtn}
                                            onClick={() => handleUploadBtnClick(index)}
                                        >
                                            Upload
                                        </Button>
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