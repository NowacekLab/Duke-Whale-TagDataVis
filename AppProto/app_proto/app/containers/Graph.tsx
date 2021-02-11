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
    const uploadsFinished = uploadProgHandler.getUploadsFinished(uploadProgState);

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
    const onGraphSelect = (graphName: string, graphPath: string) => {
        console.log("GRAPH SELECTED");
        console.log(graphPath);
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

            }

        })

    }

    return (

        <Container
            className={classes.root}
        >


            <GraphsPaper
                state={graphState}
                onUpdate={onGraphUpdate}
            />

            <GraphSelectBar 
                onGraphSelect={onGraphSelect}
            />

        </Container>

    )

}