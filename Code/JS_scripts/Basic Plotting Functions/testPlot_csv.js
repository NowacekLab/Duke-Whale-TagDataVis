/*
Code for basic plotting functions
Takes in Dataframe and Variable Names
*/

const dfd = require('danfojs-node');
const fs = require('fs');

// Function to set Axis Label depending on variable name
// Input: String
// Output: String
function setAxisLabel(axisVar){
    let label = ""
    switch(axisVar){
        case "Time":
            label = "Time (sec)";
            break;
        case "Depth":
            label = "Depth (m)";
            break;
        case "Pitch": 
        case "Roll": 
        case "Heading":
            label = "Rotation (rad)";
            break;
        case "Pitch_deg": 
        case "Roll_deg": 
        case "Heading_deg":
            label = "Rotation (deg)"
            break;
        case "WhaleAccel_X": 
        case "WhaleAccel_Y": 
        case "WhaleAccel_Z":
        case "Accel_X":
        case "Accel_Y":
        case "Accel_Z":
            label = "Acceleration (m/s^2)"
            break;
        case "Jerk_X":
        case "Jerk_Y":
        case "Jerk_Z":
            label = "Jerk (m/s^3)"
            break;
        case "Latitude":
        case "Longitude": 
            label = "Degree"
            break;
    }
    return label
}

// Variable in json foramt to designate rangeselector buttons
var selectorOptions = {
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

function getJSONOneLine(df, x, y){
    // x, y are strings
    // df is dataframe
    var plotInfo = {
        "data": [
            {
                "x": df[x].values,
                "y": df[y].values,
                "name": y,
                "type": "scatter"
            }
        ],
        "layout": {
            font: {size: 18}, 
            title: "Whale " + y + " vs. " + x,
            xaxis: {
                title: setAxisLabel(x),
                rangeselector: selectorOptions, 
                rangeslider: {},
                type: (x == "Time" ? "date" : "-")
            },
            yaxis:{
                title: setAxisLabel(y),
                autorange: (y == "Depth" ? "reversed" : true)
            }
        }
    }
    return plotInfo;
}

/* Running for a few plots
Assumes we have a dataframe loaded
*/
const calc_file_str = "file:///Users/mitchellfrisch/Documents/Whale Tag/Pm19_136aprh.csv";

dfd.read_csv(calc_file_str).then(df => { 
    // Depth vs. Time
    let x = "Time";
    let y = "Depth";
    var str = JSON.stringify(getJSONOneLine(df, x, y));
    var name = calc_file_str.split("/").pop().split(".")[0].split("_").slice(0, -1).join("_") + y + "_vs_" + x + ".json";
    console.log(name);

    fs.writeFileSync(name, str);
    // Pitch vs. Time
    y = "Pitch";
    var str = JSON.stringify(getJSONOneLine(df, x, y));
    var name = calc_file_str.split("/").pop().split(".")[0].split("_").slice(0, -1).join("_") + y + "_vs_" + x + ".json";
    console.log(name);
    fs.writeFileSync(name, str);

    // Roll vs. Time
    y = "Roll";
    var str = JSON.stringify(getJSONOneLine(df, x, y));
    var name = calc_file_str.split("/").pop().split(".")[0].split("_").slice(0, -1).join("_") + y + "_vs_" + x + ".json";
    console.log(name);
    fs.writeFileSync(name, str);

    // Roll vs. Time
    y = "Heading";
    var str = JSON.stringify(getJSONOneLine(df, x, y));
    var name = calc_file_str.split("/").pop().split(".")[0].split("_").slice(0, -1).join("_") + y + "_vs_" + x + ".json";
    console.log(name);
    fs.writeFileSync(name, str);

    }).catch(err=>{
        console.log(err);
    });