import React, {useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {getNewDataFilePath, getLoggingErrorFilePath} from "../../functions/paths";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import GenericStepper from '../GenericStepper';
import {notifsActionsHandler} from '../../functions/reduxHandlers/handlers';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
    },
    step: {
        display: "flex",
        alignItems: "center",
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

    const notifActionHandler = new notifsActionsHandler(dispatch, "Upload");

    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);
    const uploadsProgress = uploadProgHandler.getUploadsProgress(uploadProgState);

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
    const uploadGPSFileRef = useRef(null);
    const [uploadGPSFileObj, setUploadGPSFileObj] = useState<uploadFileObj>(defaultFileObj);
    const uploadFileObjects = [uploadDataFileObj, uploadGPSFileObj];
    const uploadFileObjectSetters = [setUploadDataFileObj, setUploadGPSFileObj];

    const uploadDataFileEndingsArr = [".csv", ".mat"];
    const uploadDataFileEndings = uploadDataFileEndingsArr.join(",");

    // pulled from pandas website (python file uses pandas.read_csv)
    const uploadGPSFileEndingsArr = [".xls", ".xlsx", ".xlsm", '.xlsb', '.odf', '.ods', '.odt'];
    const uploadGPSFileEndings = uploadGPSFileEndingsArr.join(",");
    const uploadFileEndings = [uploadDataFileEndings, uploadGPSFileEndings];

    const uploadFileRefs = [uploadDataFileRef, uploadGPSFileRef];

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
        const parsedNewLat = getParsedFloat(newLat);

        if (!isPositiveFloat(parsedNewLat) && newLat !== "") {
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
    const [longInputError, setLongInputError] = useState(false);
    const handleLongChange = (event: any) => {
        const newLong = event && event.target && event.target.value ? event.target.value : "";
        const parsedNewLong = getParsedFloat(newLong);

        if (!isPositiveFloat(parsedNewLong) && newLong !== "") {
            setLongInputError(true);
        } else {
            setLongInputError(false);
        }

        setLongitude(newLong);

    }
    const handleLongDirectionChange = (event: any) => {
        const newLongDirection = event && event.target && event.target.value ? event.target.value : "";
        setLongitudeDirection(newLongDirection);
    }

    function isPositiveFloat(float: any) {
        return !isNaN(float) && Number(float) >= 0;
    }

    function getParsedFloat(s: string) {
        const float = parseFloat(s);
        return float; 
    }


    const [batchName, setBatchName] = useState("");
    const [batchNameError, setBatchNameError] = useState(false);
    const [batchNextEnabled, setBatchNextEnabled] = useState(false);
    const handleBatchNameChange = (event: any) => {
        const newBatchName = event && event.target && event.target.value ? event.target.value : "";
        setBatchName(newBatchName);
    }

    const [date, setDate] = useState(new Date());
    const onDateChange = (newDate: any) => {
        setDate(newDate);
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

        const isDate = index === 2; 
        const isLatLong = index === 3;
        if (isDate) {
            return (
            <MuiPickersUtilsProvider
                utils={DateFnsUtils}
            >
                <DateTimePicker 
                    disableFuture
                    value={date}
                    onChange={onDateChange}
                />
            </MuiPickersUtilsProvider>
            )
        }

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
                <div>
                    <div>
                        {
                            latInputError ? 
    
                            <TextField 
                                error 
                                label="Latitude"
                                value={latitude}
                                onChange={handleLatChange}
                                helperText="Must be a valid positive number."
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
                    <div>

                        {
                            longInputError ? 
    
                            <TextField 
                                error 
                                label="Longitude"
                                value={longitude}
                                onChange={handleLongChange}
                                helperText="Must be a valid positive number."
                            />
    
                            :
    
                            <TextField 
                                label="Longitude"
                                value={longitude}  
                                onChange={handleLongChange}  
                            />
                        }
    
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
        return idx < 2; 
    }

    function handleBackBtnDisabled(steps: Array<any>, index: number): boolean {
        return index === 0;
    }

    function handleNextBtnDisabled(steps: Array<any>, index: number): boolean {

        if (stepNeedsFileObj(index)) {
            return shouldDisableNextBtnFileStep(index);
        }
        const isDate = index === 2;
        const latLongStep = index === 3;
        if (isDate) {
            return false;
        }
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
        const isGraphFile = index === 1; 
        return !isGraphFile;
    }

    const steps = ['Upload the data file', 'Upload the GPS file', 'Enter starting date of tag', 'Enter starting lat and long', 'Enter a unique name for this upload'];
    function getStepLabel(index: number) {
        const uploadText = steps[index];
        let stepLabel;
        const isDate = index === 2;
        const isLatLong = index === 3;

        if (stepNeedsFileObj(index)) {
            const placeholder = "No file uploaded";
            stepLabel = `${uploadText} [${getFileNameOrDefault(index, placeholder)}]`
        } else if (isDate) {
            stepLabel = `Starting Date: ${date}`
        } else if (isLatLong) {

            const parsedLatitude = getParsedFloat(latitude);
            const parsedLongitude = getParsedFloat(longitude);

            stepLabel = `${uploadText} [Lat: ${parsedLatitude} ${latitudeDirection} Longitude: ${parsedLongitude} ${longitudeDirection}]`
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
    async function handleUploadStart() {

        let trueLat = getParsedFloat(latitude); 
        if (latitudeDirection === 'e') {
            trueLat = -latitude; 
        }
        let trueLong = getParsedFloat(longitude); 
        if (longitudeDirection === 's') {
            trueLong = -longitude;
        }

        const dataFileName = uploadDataFileObj.name; 

        // Creates the new data file path as well 
        const newDataFilePath = await getNewDataFilePath(batchName, dataFileName);
        const loggingErrorFilePath = getLoggingErrorFilePath();

        //TODO: date must be converted to useful format 
        const uploadInfoObj = {
            "batchName": batchName,
            "dataFilePath": uploadDataFileObj.path, 
            "newDataFilePath": newDataFilePath,
            "loggingFilePath": loggingErrorFilePath,
            "startingDate": date.toISOString(),
            "gpsFilePath": uploadGPSFileObj.path, 
            "startLatitude": trueLat.toString(), 
            "startLongitude": trueLong.toString(), 
        }

        // Extra validation
        if (isBatchNameDup(batchName)) {
            setBatchNameError(true);
            notifActionHandler.showErrorNotif("Upload Failed. Batch name is a duplicate.");
            return;
        }

        beginUpload(uploadInfoObj);
    }

    // TODO: before button 
    const getFinalBtns = () => {
        return (
            <Button 
                onClick={handleUploadStart}
                variant="contained"
                className={classes.containedBtn}
            >
                Begin upload
            </Button>
        )
    }
    
    return ( 

        <>

            {uploadFileRefs.map((ref, index) => {

                return (
                    <input type="file" id="file-upload" ref={ref} style={{display: "none"}} onChange={(e) => {handleRefClick(e, index)}} accept={uploadFileEndings[index]}/>
                )
            
            })}

            <GenericStepper 
                steps={steps}
                getStepLabel={getStepLabel}
                getStepTextContent={getStepTextContent}
                getStepContent={getStepContent}
                handleBackBtnDisabled={handleBackBtnDisabled}
                handleNextBtnDisabled={handleNextBtnDisabled}
                getFinalBtns={getFinalBtns}
            />
        </>

    )

}