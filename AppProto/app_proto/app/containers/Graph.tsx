import React, {useState} from "react";
import {useSelector} from "react-redux";
import GraphSelectBar from "../components/Graphs/GraphSelectBar";
import GraphsPaper from "../components/Graphs/GraphsPaper";
import {getObjFromPath} from "../functions/files";
import useIsMountedRef from "../functions/useIsMountedRef";

export default function Graph() {

    const defaultGraphState = {
        data: [],
        layout: {},
        frames: [],
        config: {}
    }

    const isMounted = useIsMountedRef();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [graphState, setGraphState] = useState(defaultGraphState)
    const onGraphUpdate = (figure: any) => {
        const newData = figure['data'] ?? [];
        const newLayout = figure['layout'] ?? {};
        const newFrames = figure['frames'] ?? [];
        setGraphState({
            ...graphState,
            'data': newData,
            'layout': newLayout,
            'frames': newFrames,
        });
    }
    const onGraphSelect = (graphName: string, graphPath: string) => {

        if (graphName === "" || graphPath === "") {
            setGraphState(defaultGraphState);
            return;
        }

        setLoading(true);
        setProgress(10);

        isMounted && getObjFromPath(graphPath).then((obj) => {
            
            if (!isMounted) return;

            if (obj) {
                let data = [];
                let layout = {};
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

                onGraphUpdate(newGraphState); 
            }

        }).catch(() => {
            
        })
    }

    const endProgress = () => {
        setProgress(100);
        if (isMounted) {
          setTimeout(
            () => {
              if (isMounted) {
                setLoading(false);
              }
            }, 500)
        }
      }

    return (

        <div
            className="container"
        >
            <GraphsPaper
                loading={loading}
                progress={progress}
                state={graphState}
                onUpdate={onGraphUpdate}
                onFinishLoading={endProgress}
            />

            <GraphSelectBar 
                onGraphSelect={onGraphSelect}
            />

        </div>

    )

}