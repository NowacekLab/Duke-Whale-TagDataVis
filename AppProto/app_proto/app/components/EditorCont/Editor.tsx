import React, {useState} from 'react'; 
// @ts-ignore
import plotly from "plotly.js/dist/plotly";

// @ts-ignore
import PlotlyEditor from "react-chart-editor"; 

const dataSources = {
    col1: [1, 2, 3], // eslint-disable-line no-magic-numbers
    col2: [4, 3, 2], // eslint-disable-line no-magic-numbers
    col3: [17, 13, 9], // eslint-disable-line no-magic-numbers
};

const dataSourceOptions = Object.keys(dataSources).map((name) => ({
    value: name,
    label: name,
}));

const config = {editable: true};

export default function Editor() {

    const data: Array<any> = [];
    const layout: Array<any> = [];
    const frames: Array<any> = [];
    const [state, setState] = useState({
        data: data,
        layout: layout,
        frames: frames
    })

    return (
        <PlotlyEditor
            data={state.data}
            layout={state.layout}
            config={config}
            frames={state.frames}
            dataSources={dataSources}
            dataSourceOptions={dataSourceOptions}
            plotly={plotly}
            onUpdate={(data: Array<any>, layout: Array<any>, frames: Array<any>) => setState({data, layout, frames})}
            useResizeHandler
            debug
            advancedTraceTypeSelector
        />    
    )
}