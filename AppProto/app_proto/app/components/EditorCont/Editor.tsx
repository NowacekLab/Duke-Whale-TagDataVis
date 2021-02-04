import React, {useState, useEffect} from 'react'; 
import CustomEditor from "./CustomEditor";
import EditorBottomNav from "./EditorBottomNav";
import {loadFileInfoArr} from "../../functions/uploads/upload";
import {getObjFromPath} from "../../functions/files";

export default function Editor() {

    const [fileInfoArr, setFileInfoArr] = useState([]);
    useEffect(() => {
        loadFileInfoArr().then((fileInfoArr) => {

            //@ts-ignore
            setFileInfoArr(fileInfoArr);
        })
    }, [])


    const [dataSources, setDataSources] = useState({});
    const onBatchSelect = (batchName: string, batchColFilePath: string) => {
        console.log("BATCH SELECTED");
        console.log(batchName);
        console.log(batchColFilePath);

        getObjFromPath(batchColFilePath).then((colData) => {

            console.log("COL DATA FROM PATH");
            console.log(colData);

            setDataSources(colData);
        })
    }

    return (
        <div>
            <CustomEditor dataSources={dataSources} />

            <EditorBottomNav
                onBatchSelect={onBatchSelect}
                fileInfoArr={fileInfoArr}
            />

        </div>
    )
}