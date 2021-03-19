import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Plot from "react-plotly.js";
import {deepCopyObjectOnlyProps} from "../../functions/object_helpers";
import CircularProgress from '@material-ui/core/CircularProgress';
import useIsMountedRef from '../../functions/useIsMountedRef';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles({
    uploadPaper: {
        height: "80%",
        width: "80%",
        display: "table",
        padding: "20px"
    },
    uploadPaperTitle: {
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
        left: 0,
        right: 0,
        bottom: 0,
        top: 0 
    }
});

interface GraphState {
    data: Array<any>,
    layout: any,
    frames: Array<any>,
    config: any
}

type GraphPaperProps = {
    loading: boolean,
    progress: number,
    state: GraphState,
    onUpdate: any
}

const GraphsPaper = (props: GraphPaperProps) => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

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
                {
                    props.loading ? 
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <CircularProgress 
                            variant="determinate"
                            value={props.progress}
                        />
                    </div>
                    :
                    <Fade
                        in={!props.loading}
                    >
                        <Plot 
                            data={state.data}
                            layout={state.layout}
                            frames={state.frames}
                            config={state.config}
                            className={classes.mainBody}
                        />
                    </Fade>

                    // <h1>
                    //     Failed to render plot.
                    // </h1>
                }
        </Paper>

    );
};

export default GraphsPaper;