import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Plot from "react-plotly.js";
import {deepCopyObjectOnlyProps} from "../../functions/object_helpers";

const useStyles = makeStyles({
    uploadPaper: {
        height: "80%",
        width: "80%",
        display: "table",
    },
    uploadPaperTitle: {
        fontSize: "2em",
        fontWeight: "bold",
        width: "100%",
        justifyContent: "flex-start",
        margin: 0,
    },
    uploadTopBarContainer: {
        display: "flex",
        justifyContent: "flex-start",
        width: "100%"
    },
    uploadTabsContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px"
    },
    uploadTabInactive: {
        padding: 0,
        textTransform: "none"
    },
    uploadTabActive: {
        padding: 0,
        textTransform: "none",
        fontWeight: "bold"
    },
    mainBody: {
        width: "100%",
        height: "100%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});

interface GraphState {
    data: Array<any>,
    layout: any,
    frames: Array<any>,
    config: any
}

type GraphPaperProps = {
    state: GraphState,
    onUpdate: any
}

const GraphsPaper = (props: GraphPaperProps) => {
    const classes = useStyles();

    const defaultGraphState = {
        data: [],
        layout: {},
        frames: [],
        config: {}
    }
    const [state, setState] = useState(defaultGraphState);
    useEffect(() => {
        //@ts-ignore
        setState(props.state)
    }, [props.state])

    return (        
        <Paper
            elevation={3}
            className={classes.uploadPaper}
        >
            <h1
                className={classes.uploadPaperTitle}
            > 
                Graph View
            </h1>

            <div
                className={classes.uploadTopBarContainer}
            >

            </div>
            
            <div
                className={classes.mainBody}
            >
                {
                    <Plot 
                        data={state.data}
                        layout={state.layout}
                        frames={state.frames}
                        config={state.config}
                    />

                    ??

                    <h1>
                        Failed to render plot.
                    </h1>
                }


            </div>


        </Paper>

    );
};

export default GraphsPaper;