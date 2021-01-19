const dfd = require("danfojs-node")
const tf = require("@tensorflow/tfjs-node")

// find function to get the path to the current file to get the 
// relative csv location

function getJSONOneLine(df, x, y){
    // x, y are strings
    // df is dataframe
    var plotInfo = {
        "data": [
            {
                "x": df[x].values,
                "y": df[y].values,
                "name": "Whale " + x + " vs. " + y,
                "type": "scatter"
            }
        ]
    }
    return plotInfo;
}


function getJSONMultipleLines(df, xvars, yvars){
    // loops through yvars
    var i;
    var trace;
    var traces = new Array(yvars.length);
    for(i = 0; i<yvars.length; i++){
        trace = {
            x : df[xvars].values,
            y : df[yvars[i]].values,
            type : 'scatter',
            name : yvars[i]
        }
        traces[i] = trace;
    }
    var plotInfo = {
        "data" : traces,
    };
    return plotInfo;
}
