import React, {useState, useEffect} from 'react'; 
// @ts-ignore
import plotly from "plotly.js/dist/plotly";

// @ts-ignore
import PlotlyEditor from "react-chart-editor"; 

import CustomEditorChild from './CustomEditorChild';

const config = {editable: true};

type CustomEditorProps = {
    dataSources: any, 
}

export default function CustomEditor(props: CustomEditorProps) {

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

    useEffect(() => {
        setDataSources(props.dataSources);
        setState({
            data: data,
            layout: layout,
            frames: frames
        })
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

    return (
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
    )
}