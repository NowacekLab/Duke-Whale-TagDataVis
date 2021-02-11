import React, {useState, useEffect} from 'react'; 
import {makeStyles} from "@material-ui/core/styles";
import CustomEditor from "./CustomEditor";
import EditorBottomNav from "./EditorBottomNav";
import {loadFileInfoArr} from "../../functions/uploads/upload";
import {getObjFromPath} from "../../functions/files";
import useIsMountedRef from "../../functions/useIsMountedRef";

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        flexDirection: "column",
        height: "100%",
        width: "100%"
    }
})

export default function Editor() {

    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    const [tempDataSources, setTempDataSources] = useState({});
    const [dataSources, setDataSources] = useState({});
    const onBatchSelect = (batchName: string, batchColFilePath: string) => {
        console.log("BATCH SELECTED");
        console.log(batchName);
        console.log(batchColFilePath);

        isMountedRef && getObjFromPath(batchColFilePath).then((colData) => {

            if (!isMountedRef) return;

            console.log("COL DATA FROM PATH");
            console.log(colData);

            setTempDataSources(colData);
        })
    }
    const onRangeConfirmation = (min: number, max: number) => {
        const newDataSources = {} as any;

        if (!tempDataSources) return;

        console.log("RANGE CONFIRMATION");
        console.log(tempDataSources);
        console.log(min);
        console.log(max);

        for (let col in tempDataSources) {
            console.log("COL: ");
            console.log(col);

             //@ts-ignore
            newDataSources[col] = tempDataSources[col] ? tempDataSources[col].slice(min, max) : [];
        }
        setDataSources(newDataSources);
    }
    

    return (
        <div
            className={classes.root}
        >
            <CustomEditor dataSources={dataSources} />

            <EditorBottomNav
                onBatchSelect={onBatchSelect}
                onRangeConfirm={onRangeConfirmation}
            />

        </div>
    )
}