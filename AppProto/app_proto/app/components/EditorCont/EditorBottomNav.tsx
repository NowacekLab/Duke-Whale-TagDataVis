import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import RangeSelectDialog from './RangeSelectDialog';
import SelectBatchDialog from '../SelectBatchDialog';

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "20%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paperWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        outline: "none",
        maxHeight: "80%",
        width: "50%"
    },
    paperTreeCont: {
        outline: "none",
        overflow: "auto",
        maxHeight: "100%",
        width: "100%",
    },
    rangeFieldCont: {
        display: "flex",
        gap: "10px",
        outline: "none",
        padding: "20px"
    },
    btnContainer: {
        display: "flex",
        gap: "10px"
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

type EditorBottomNavProps = {
    onBatchSelect: any,
    onRangeConfirm: any,
}

export default function EditorBottomNav(props: EditorBottomNavProps) {

    const classes = useStyles();
    const dispatch = useDispatch();

    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);

    const [chosenColPath, setChosenColPath] = useState("");
    const [tempColPath, setTempColPath] = useState("");

    const [tempBatchName, setTempBatchName] = useState("");
    const [chosenBatchName, setChosenBatchName] = useState("");
    const confirmTempBatchName = () => {
        setChosenBatchName(tempBatchName);
        setChosenColPath(tempColPath);
        handleBatchModalClose();
        props.onBatchSelect(tempBatchName, tempColPath);
    }
    const batchBtnVal = chosenBatchName === "" ? "No batch chosen" : chosenBatchName;


    const [currBatchInfo, setCurrBatchInfo] = useState([]);
    const [showBatchModal, setShowBatchModal] = useState(false);
    const handleBatchModalClose = () => {
        setShowBatchModal(false);
    }
    const toggleBatchModal = () => {
        setShowBatchModal(!showBatchModal);
    }

    const [infoOpen, setInfoOpen] = useState(false);
    
    const viewCurrBatchInfo = (batchName: string) => {

        //@ts-ignore
        const uploadProgObj = uploadsFinished[batchName];
        const uploadInfoArr = uploadProgObj ? uploadProgObj["uploadInfoArr"] : [];
        const colPath = uploadProgObj["cols"] && uploadProgObj["cols"]["cols.json"] ? uploadProgObj["cols"]["cols.json"] : "";

        setTempBatchName(batchName);
        setTempColPath(colPath);
        setCurrBatchInfo(uploadInfoArr);
        setInfoOpen(true);
    }

    const [realMinRange, setRealMinRange] = useState("0");
    const [realMaxRange, setRealMaxRange] = useState("100");
    const [rangeConfirmed, setRangeConfirmed] = useState(false);
    const onRangeConfirmation = (inputMinRange: string, inputMaxRange: string) => {
        let realMinRange;
        try {
            realMinRange = Number.parseInt(inputMinRange);
        } catch {
            realMinRange = 0;
        }
        let realMaxRange;
        try {
            realMaxRange = Number.parseInt(inputMaxRange);
        } catch {
            realMaxRange = 100;
        }
        setRealMinRange(`${realMinRange}`);
        setRealMaxRange(`${realMaxRange}`);
        props.onRangeConfirm(realMinRange, realMaxRange);
        handleRangeModalClose();
        setRangeConfirmed(true);
    }
    const [showRangeModal, setShowRangeModal] = useState(false);
    const handleRangeModalClose = () => {
        setShowRangeModal(false);
    }
    const toggleRangeModal = () => {
        setShowRangeModal(!showRangeModal);
    }


    return (
        <div
            className={classes.root}
        >   
            <div
                className={classes.btnContainer}
            >
                <Button
                    onClick={toggleBatchModal}
                    className={classes.btn}
                    variant="outlined"
                >
                    {batchBtnVal}
                </Button>

                <Button
                    className={classes.btn}
                    onClick={toggleRangeModal}
                    variant="outlined"
                >
                    {rangeConfirmed ? `${realMinRange} : ${realMaxRange}` : "Confirm Range"}
                </Button>
            </div>

            <SelectBatchDialog 
                showModal={showBatchModal}
                handleClose={handleBatchModalClose}
                handleBack={handleBatchModalClose}
                currBatchInfo={currBatchInfo}
                infoOpen={infoOpen}
                onInfoClose={() => setInfoOpen(false)}
                displayBatchName={tempBatchName}
                confirmDisplayBatchName={confirmTempBatchName}
                viewBatchInfo={viewCurrBatchInfo}
                uploads={uploadsFinished}
            />

            <RangeSelectDialog 
                showModal={showRangeModal}
                handleClose={handleRangeModalClose}
                handleBack={handleRangeModalClose}
                onRangeConfirm={onRangeConfirmation}
                currInputMinRange={realMinRange}
                currInputMaxRange={realMaxRange}
            />


        </div>
    )

}
