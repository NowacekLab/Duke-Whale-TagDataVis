import React, {useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {getNewDataFilePath, getLoggingErrorFilePath} from "../../functions/paths";
import {fileNameFromPath} from "../../functions/paths";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";

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

type UploadStepperProps = {
    beginUpload: Function,
}

export default function UploadStepper({beginUpload} : UploadStepperProps) {

    const classes = useStyles();

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);
    const uploadsProgress = uploadProgHandler.getUploadsProgress(uploadProgState);


    const [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
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

    function getStepTextContent(index: number) {

        if (stepNeedsFileObj(index)) {
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
    }

    const [latitude, setLatitude] = useState("");
    const [latitudeDirection, setLatitudeDirection] = useState("W");
    const [latInputError, setLatInputError] = useState(false);
    const handleLatChange = (event: any) => {
        const newLat = event && event.target && event.target.value ? event.target.value : "";

        if (!isPositiveFloat(newLat) && newLat !== "") {
            setLatInputError(true);
        } else {
            setLatInputError(false);
        }

        setLatitude(newLat);
    }
    const handleLatDirectionChange = (event: any) => {
        const newLatDirection = event && event.target && event.target.value ? event.target.value : "";
        setLatitudeDirection(newLatDirection);
    }

    const [longitude, setLongitude] = useState("");
    const [longitudeDirection, setLongitudeDirection] = useState("N");
    const handleLongChange = (event: any) => {
        const newLong = event && event.target && event.target.value ? event.target.value : "";
        setLongitude(newLong);
    }
    const handleLongDirectionChange = (event: any) => {
        const newLongDirection = event && event.target && event.target.value ? event.target.value : "";
        setLongitudeDirection(newLongDirection);
    }

    function isPositiveFloat(s: string) {
        const float = parseFloat(s);
        return !isNaN(float) && Number(float) >= 0;
    }



    const [batchName, setBatchName] = useState("");
    const [batchNameError, setBatchNameError] = useState(false);
    const [batchNextEnabled, setBatchNextEnabled] = useState(false);
    const handleBatchNameChange = (event: any) => {
        const newBatchName = event && event.target && event.target.value ? event.target.value : "";
        setBatchName(newBatchName);
    }

    useEffect(() => {
        handleBatchErrorNext(batchName);
    }, [batchName])
    const handleBatchErrorNext = (newBatchName: string) => {
        console.log("new batch name");
        console.log(newBatchName);

        const batchNameDup = isBatchNameDup(newBatchName);
        if (batchNameDup || batchName === "") {

            console.log("batcherrornext 1")
            setBatchNextEnabled(false);
            setBatchNameError(true);
        } else {

            console.log("batcherrornext 2")
            setBatchNextEnabled(true);
            setBatchNameError(false);
        }
    }

    const batchNames = function(){

        const batch_names = new Set();

        for (let batchName in uploadsFinished) {
            batch_names.add(batchName);
        }

        for (let batchName in uploadsProgress) {
            batch_names.add(batchName);
        }

        return batch_names;
    }();

    const isBatchNameDup = (newBatchName: string): boolean => {
        console.log("BATCH NAMES");
        console.log(batchNames);
        console.log(batchNames.has(newBatchName));

        return batchNames.has(newBatchName);
    }

    function getStepContent(index: number) {

        if (stepNeedsFileObj(index)) {
            return (
                <Button
                    variant="contained"
                    className={classes.containedBtn}
                    onClick={() => handleUploadBtnClick(index)}
                >
                    Upload
                </Button>
            )
        }

        const isLatLong = index === 3;
        if (!isLatLong) {

            return (
                <div
                    style={{
                        padding: "10px"
                    }}
                >
                    {
                        batchNameError ?
                        <TextField 
                            error
                            label="Batch Name"
                            value={batchName}
                            onChange={handleBatchNameChange}
                            helperText="Provide a unique, non-empty name for your upload."
                        />
                        :
                        <TextField 
                            label="Batch Name"
                            value={batchName}
                            onChange={handleBatchNameChange}
                        />
                    }

                </div>
            )

        }

        if (isLatLong) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "space-between"
                        }}
                    >
                        {
                            latInputError ? 
    
                            <TextField 
                                error 
                                label="Latitude"
                                value={latitude}
                                onChange={handleLatChange}
                                helperText="Must be a valid number."
                            />
    
                            :
    
                            <TextField 
                                label="Latitude"
                                value={latitude}  
                                onChange={handleLatChange}  
                            />
                        }
    
                        <TextField
                            select 
                            label="Direction"
                            value={latitudeDirection}
                            onChange={handleLatDirectionChange}
                        >
    
                            <MenuItem key={"W"} value={"W"}>
                                W
                            </MenuItem>
    
                            <MenuItem key={"E"} value={"E"}>
                                E
                            </MenuItem>
    
                        </TextField>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "space-between"
                        }}
                    >
                        <TextField 
                            label="Longitude"
                            value={longitude}
                            onChange={handleLongChange}
                        />
    
                        <TextField
                            select 
                            label="Direction"
                            value={longitudeDirection}
                            onChange={handleLongDirectionChange}
                        >
                            <MenuItem key={"N"} value={"N"}>
                                N
                            </MenuItem>
    
                            <MenuItem key={"S"} value={"S"}>
                                S
                            </MenuItem>
    
                        </TextField>
                    </div>
                </div>
            )
        }


    }


    const stepNeedsFileObj = (idx: number) => {
        return idx < 3; 
    }

    function handleNextBtnDisabled(index: number): boolean {

        if (stepNeedsFileObj(index)) {
            return shouldDisableNextBtnFileStep(index);
        }

        const latLongStep = index === 3;
        if (!latLongStep) {
            return shouldDisableNextBtnBatchName();
        }  

        return shouldDisableNextBtnInputStepLatLong(index);
    }

    function shouldDisableNextBtnBatchName() {
        return !batchNextEnabled;
    }

    function shouldDisableNextBtnInputStepLatLong(index: number): boolean {
        return !(latitude.length > 0 && longitude.length > 0);
    }

    function shouldDisableNextBtnFileStep(index: number): boolean {
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

    const steps = ['Upload the data file', 'Upload the log file', 'Upload the GPS file', 'Enter starting lat and long', 'Enter a unique name for this upload'];
    function getStepLabel(index: number) {
        const uploadText = steps[index];
        let stepLabel;
        const isLatLong = index === 3;

        if (stepNeedsFileObj(index)) {
            const placeholder = "No file uploaded";
            stepLabel = `${uploadText} [${getFileNameOrDefault(index, placeholder)}]`
        } else if (isLatLong) {
            stepLabel = `${uploadText} [Lat: ${latitude} ${latitudeDirection} Longitude: ${longitude} ${longitudeDirection}]`
        } else {
            stepLabel = `${uploadText} [${batchName}]`

        }

        return stepLabel;
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



    const handleReset = () => {
        setActiveStep(0);
        resetFileObjs();
    }
    const resetFileObjs = () => {
        setUploadDataFileObj(defaultFileObj);
        setUploadLogFileObj(defaultFileObj);
        setUploadGPSFileObj(defaultFileObj);
        setLatitude("");
        setLongitude("");
        setBatchName("");
    }



    const handleUploadStart = () => {

        let trueLat = latitude; 
        if (latitudeDirection === 'e') {
            trueLat = "-" + latitude; 
        }
        let trueLong = longitude; 
        if (longitudeDirection === 's') {
            trueLong = "-" + longitude;
        }

        const dataFileName = uploadDataFileObj.name; 
        const newDataFilePath = getNewDataFilePath(batchName, dataFileName);
        const loggingErrorFilePath = getLoggingErrorFilePath();

        const uploadInfoObj = {
            "dataFilePath": uploadDataFileObj.path, 
            "newDataFilePath": newDataFilePath,
            "loggingFilePath": loggingErrorFilePath,
            "logFilePath": uploadLogFileObj.path, 
            "gpsFilePath": uploadGPSFileObj.path, 
            "startLatitude": trueLat, 
            "startLongitude": trueLong 
        }
        
        const batchInfoArr = function infoToBatch() {
            const arr = [
                {
                    title: "Data File Name",
                    info: fileNameFromPath(uploadDataFileObj.path)
                },
                {
                    title: "Log File Name",
                    info: fileNameFromPath(uploadLogFileObj.path)
                },
                {
                    title: "GPS File Name",
                    info: fileNameFromPath(uploadGPSFileObj.path)
                },
                {
                    title: "Start Lat & Long",
                    info: `Lat (${trueLat}), Long (${trueLong})`
                }

            ];

            return arr;
        }();

        const batchInfo = {
            "batchName": batchName,
            "batchInfo": batchInfoArr
        }

        beginUpload(uploadInfoObj, batchInfo);

        resetFileObjs();
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