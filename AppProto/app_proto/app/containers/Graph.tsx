import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import GraphSelectBar from "../components/Graphs/GraphSelectBar";
import GraphsPaper from "../components/Graphs/GraphsPaper";
import {getObjFromPath} from "../functions/files";
import {deepCopyObjectOnlyProps} from "../functions/object_helpers";
import uploadsActionsHandler from "../functions/uploads/uploadsActionsHandler";
import useIsMountedRef from "../functions/useIsMountedRef";

const useStyles = makeStyles({
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative"
    },
})

export default function Graph() {

    const classes = useStyles();

    const defaultGraphState = {
        data: [],
        layout: {},
        frames: [],
        config: {}
    }

    const isMounted = useIsMountedRef();

    const dispatch = useDispatch();
    //@ts-ignore
    const uploadProgState = useSelector(state => state["uploads"]);
    const uploadProgHandler = new uploadsActionsHandler(dispatch);
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

        setLoading(true);
        setProgress(10);

        isMounted && getObjFromPath(graphPath).then((obj) => {
            
            if (!isMounted) return;

            console.log("OBJECT FROM PATH: ");
            console.log(obj);

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
                
                console.log("NEW GRAPH STATE: ");
                console.log(newGraphState);


                onGraphUpdate(newGraphState); 
                
                endProgress();
            }

        }).catch(() => {
            endProgress();
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

        <Container
            className={classes.root}
        >
            <GraphsPaper
                loading={loading}
                progress={progress}
                state={graphState}
                onUpdate={onGraphUpdate}
            />

            <GraphSelectBar 
                onGraphSelect={onGraphSelect}
            />

        </Container>

    )

}