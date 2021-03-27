import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {uploadsActionsHandler} from "../../functions/reduxHandlers/handlers";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SelectBatchBtn from '../SelectBatchBtn';
import SelectRangeBtn from '../SelectRangeBtn';

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

    const [batchName, setBatchName] = useState(""); 
    const [colPath, setColPath] = useState("");
    const onBatchNameSelect = (batchName: string) => {
        //@ts-ignore
        const uploadProgObj = uploadsFinished[batchName];
        const colPath = uploadProgObj["cols"] && uploadProgObj["cols"]["cols.json"] ? uploadProgObj["cols"]["cols.json"] : "";
        setColPath(colPath);
        setBatchName(batchName);
        setRangeConfirmed(false);
        resetRangeSelection();
        props.onBatchSelect(batchName, colPath);
    }

    const resetRangeSelection = () => {
        setRangeConfirmed(false);
        setRealMinRange("0");
        setRealMaxRange("100");
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
        setRangeConfirmed(true);
    }


    return (
        <div
            className={classes.root}
        >   

            <div
                className="flex-col-center"
                style={{
                    gap: "10px"
                }}
            >

                <Button
                    id="color-themed"
                    className="btn"
                    disabled={true}
                >
                    Save
                </Button>

                <div
                    className={classes.btnContainer}
                >
                    <SelectBatchBtn 
                        batchName={batchName}
                        onBatchSelect={onBatchNameSelect}
                    />

                    <SelectRangeBtn     
                        batchName={batchName}
                        realMinRange={realMinRange}
                        realMaxRange={realMaxRange}
                        rangeConfirmed={rangeConfirmed}
                        onRangeConfirmation={onRangeConfirmation}
                    />
                </div>
            </div>

        </div>
    )

}
