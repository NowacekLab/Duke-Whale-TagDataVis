import React, {useState, useEffect} from "react";
import Container from '@material-ui/core/Container';
import GraphSelectBar from "../components/Graphs/GraphSelectBar";
import GraphsPaper from "../components/Graphs/GraphsPaper";
import {loadFileInfoArr} from "../functions/uploads/upload";
import {getObjFromPath} from "../functions/files";
import {deepCopyObjectOnlyProps} from "../functions/object_helpers";

export default function Graph() {

    const defaultGraphState = {
        data: [],
        layout: {},
        frames: [],
        config: {}
    }
    const [graphState, setGraphState] = useState(defaultGraphState)
    const onGraphUpdate = (figure: any) => {
        const newData = figure['data'] ?? [];
        const newLayout = figure['layout'] ?? {};
        const newFrames = figure['frames'] ?? [];

        const newGraphState = deepCopyObjectOnlyProps(graphState);
        newGraphState['data'] = newData;
        newGraphState['layout'] = newLayout;
        newGraphState['frames'] = newFrames;

        console.log("I SET THE NEW GRAPH STATE: ");
        console.log(newGraphState);
        setGraphState(newGraphState);
    }

    const [chosenBatchName, setChosenBatchName] = useState("");
    const onBatchChoiceChange = (batchName: string) => {
        setChosenBatchName(batchName);
    }
    const onGraphSelect = (graphName: string, graphPath: string) => {
        console.log("GRAPH SELECTED");
        console.log(graphPath);
        getObjFromPath(graphPath).then((obj) => {

            console.log("OBJECT FROM PATH: ");
            console.log(obj);

            if (obj) {
                let data;
                let layout;
                if (obj.hasOwnProperty("data")) {
                    data = obj["data"];
                }
                if (obj.hasOwnProperty("layout")) {
                    layout = obj["layout"];
                }
                const newGraphState = {
                    data: data,
                    layout: layout 
                }
                
                console.log("NEW GRAPH STATE: ");
                console.log(newGraphState);


                onGraphUpdate(newGraphState);

            }

        })

    }


    const [fileInfoArr, setFileInfoArr] = useState([]);
    useEffect(() => {
        loadFileInfoArr().then((fileInfoArr) => {

            //@ts-ignore
            setFileInfoArr(fileInfoArr);
        })
    }, [])


    return (

        <Container>


            <GraphsPaper
                state={graphState}
                onUpdate={onGraphUpdate}
            />

            <GraphSelectBar 
                chosenBatch={chosenBatchName}
                onBatchChoiceChange={onBatchChoiceChange}
                onGraphSelect={onGraphSelect}
                fileInfoArr={fileInfoArr}
            />

        </Container>

    )

}