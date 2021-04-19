import React, {useState, useEffect} from 'react'; 
// @ts-ignore
import plotly from "plotly.js/dist/plotly";
import {useDispatch} from 'react-redux';
// @ts-ignore
import PlotlyEditor from "react-chart-editor"; 
import EditorSaveBtn from './EditorSave/EditorSaveBtn';
import EditorLoadBtn from './EditorLoad/EditorLoadBtn';
import {editorSave} from '../../functions/editor/editoractions';
import { throwErrIfFail } from '../../functions/responses';
import notifsActionsHandler from '../../functions/notifs/notifsActionsHandler';
import uploadsActionsHandler from '../../functions/uploads/uploadsActionsHandler';
import { getObjFromPath } from '../../functions/files';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const config = {editable: true};

type CustomEditorProps = {
    dataSources: any, 
}

export default function CustomEditor(props: CustomEditorProps) {

    const dispatch = useDispatch();
    const notifActionHandler = new notifsActionsHandler(dispatch, "Editor");
    const uploadActionHandler = new uploadsActionsHandler(dispatch);

    const [dataSources, setDataSources] = useState({});

    const dataSourceOptions = function(){
        if (!dataSources) return [];
        const keys = Object.keys(dataSources);
        if (!keys) return [];
        return keys.map((name) => ({
            value: name,
            label: name
        }))
    }();

    const onReset = () => {
        setState({
            data: data,
            layout: layout,
            frames: frames,
        })
        setDataSources({});
    }

    useEffect(() => {
        setDataSources(props.dataSources);
    }, [props.dataSources])

    const data: Array<any> = [];
    const layout = {} as any;
    const frames: Array<any> = [];
    const [state, setState] = useState({
        data: data,
        layout: layout,
        frames: frames
    })

    useEffect(() => {
        console.log("CUSTOM EDITOR STATE");
        console.log(state.data);
        console.log(state.layout);
        console.log(state.frames);
    }, [state])

    async function onSave(parentDir: string, batchName: string, graphName: string) {
        try {
            const res = await editorSave(parentDir, batchName, graphName, state);
            throwErrIfFail(res);
            uploadActionHandler.refreshAllUploads();
            notifActionHandler.showSuccessNotif("Successfully saved graph");
        } catch (error) {
            notifActionHandler.showErrorNotif("Failed to save graph");
        }
    }

    async function onDataLoad(graphPath: string) {
        try {
            const graphState = await getObjFromPath(graphPath);
            setState(graphState);
            notifActionHandler.showSuccessNotif("Successfully loaded graph");
        } catch (error) {
            notifActionHandler.showErrorNotif("Failed to load graph");
        }

    }

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}
        >
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    maxHeight: "100%",
                    overflowY: "auto"
                }}
            >
                <PlotlyEditor
                    data={state.data}
                    layout={state.layout}
                    config={config}
                    frames={state.frames}
                    dataSources={dataSources}
                    dataSourceOptions={dataSourceOptions}
                    plotly={plotly}
                    onUpdate={(data: Array<any>, layout: Array<any>, frames: Array<any>) => setState({data: data, layout: layout, frames: frames})}
                    useResizeHandler
                    debug
                    advancedTraceTypeSelector
                />
            </div>
            
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: "10px"
                }}
            >

                <EditorSaveBtn 
                    onSave={onSave}
                />

                <EditorLoadBtn 
                    onDataLoad={onDataLoad}
                />

                <Button
                    id="color-themed"
                    className="btn"
                    onClick={() => onReset()}
                >
                    Reset
                </Button>
            </div>

        </div>
    )
}