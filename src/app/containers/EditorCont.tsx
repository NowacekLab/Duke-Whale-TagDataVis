import React, {useState} from 'react'; 
import CustomEditor from "../components/EditorCont/CustomEditor";
import EditorBottomNav from "../components/EditorCont/EditorBottomNav";
import {getObjFromPath} from "../functions/files";
import useIsMountedRef from "../functions/useIsMountedRef";

export default function EditorCont() {

    const isMountedRef = useIsMountedRef();

    const [tempDataSources, setTempDataSources] = useState({});
    const [dataSources, setDataSources] = useState({});
    const onBatchSelect = (batchName: string, batchColFilePath: string) => {

        isMountedRef && getObjFromPath(batchColFilePath).then((colData) => {

            if (!isMountedRef) return;

            setTempDataSources(colData);
        })
    }
    const onRangeConfirmation = (min: number, max: number) => {
        const newDataSources = {} as any;

        if (!tempDataSources) return;

        for (let col in tempDataSources) {
             //@ts-ignore
            newDataSources[col] = tempDataSources[col] ? tempDataSources[col].slice(min, max) : [];
        }
        setDataSources(newDataSources);
    }
    

    return (
        <div
            className="container"
        >
            <CustomEditor dataSources={dataSources} />

            <EditorBottomNav
                onBatchSelect={onBatchSelect}
                onRangeConfirm={onRangeConfirmation}
            />

        </div>
    )
}