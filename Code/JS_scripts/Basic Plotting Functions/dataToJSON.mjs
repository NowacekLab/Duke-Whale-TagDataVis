

// find function to get the path to the current file to get the 
// relative csv location

function getJSONOneLine(df, x, y){
    var plotInfo = {
        "data": [
            {
                "x": df[x],
                "y": df[y],
                "name": "Whale " + x + " vs. " + y,
                "type": "scatter"
            }
        ]
    }
    return plotInfo;
}

// xvar is a single element list
function getJSONMultipleLines(df, xvar, yvars){
    // loops through yvars

    var traces = new Array(yvars.length);
    
    var trace;
    for(i = 0; i<yvars.length; i++){
        trace = {
            x : df[xvar[0]],
            y : df[yvars[i]],
            type : 'scatter',
            name : yvars[i]
        }
        traces[i] = trace;
    }
    var plotInfo = {
        "data" : traces,
        "layout": {
            font: {size: 18},
            title: yvars.toString() + " vs. " + xvar[0],
            xaxis: {
                title: xvar[0],
                rangeslider: {},
                type: (x == "Time" ? "date" : "-")
            },
            yaxis:{
                autorange: (y == "Depth" ? "reversed" : true)
            }
        }
    }
    return plotInfo;
}
