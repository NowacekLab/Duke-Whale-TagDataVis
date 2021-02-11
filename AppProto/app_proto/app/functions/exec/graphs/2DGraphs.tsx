//@ts-nocheck

export const graphingFuncs2D = {
    "depth_vs_time": time_depth,
    "pitch_vs_time": time_pitch,
    "roll_vs_time": time_roll,
    "heading_vs_time": time_heading
};

const axisLabels = {
    "Time": "Time (sec)",
    "Depth": "Depth (m)",
    "Heading": "Rotation (rad)",
    "Heading_deg": "Rotation (deg)",
    "Accel_Z": "Acceleration (m/s^2)",
    "Jerk_Z": "Jerk (m/s^3)",
    "Longitude": "Degree"
}
function getAxisLabel(axis: string) {
    if (!axisLabels.hasOwnProperty(axis)) return axis;
    return axisLabels[axis];
}

type DataFrame = any;
function generic2DPlot(df: DataFrame, x: string, y: string) {

    const selectorOptions = {
        buttons: [{
            step: 'hour',
            stepmode: 'backward',
            count: 1,
            label: '1 hr'
        }, {
            step: 'minute',
            stepmode: 'backward',
            count: 30,
            label: '30 min'
        }, {
            step: 'minute',
            stepmode: 'backward',
            count: 5,
            label: '5 min'
        }, {
            step: 'minute',
            stepmode: 'backward',
            count: 1,
            label: '1 min'
        }, {
            step: 'second',
            stepmode: 'backward',
            count: 30,
            label: '30 sec'
        }, {
            step: 'all',
        }],
    };

    const plotInfo = {
        "data": [
            {
                "x": df[x],
                "y": df[y],
                "name": y,
                "type": "scatter"
            }
        ],
        "layout": {
            font: {size: 18}, 
            title: "Whale " + y + " vs. " + x,
            xaxis: {
                title: getAxisLabel(x),
                rangeselector: selectorOptions, 
                rangeslider: {},
                type: (x == "Time" ? "date" : "-")
            },
            yaxis:{
                title: getAxisLabel(y),
                autorange: (y == "Depth" ? "reversed" : true)
            }
        }
    }

    return plotInfo;
};

function time_depth(df: DataFrame) {
    const x = "Time";
    const y = "Depth";
    return generic2DPlot(df, x, y);
}

function time_pitch(df: DataFrame) {
    const x = "Time";
    const y = "Pitch";
    return generic2DPlot(df, x, y);
}

function time_roll(df: DataFrame) {
    const x = "Time";
    const y = "Roll";
    return generic2DPlot(df, x, y);
}

function time_heading(df: DataFrame) {
    const x = "Time";
    const y = "Heading";
    return generic2DPlot(df, x, y);
}