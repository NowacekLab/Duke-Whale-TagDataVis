

// find function to get the path to the current file to get the 
// relative csv location

function getJSONOneLine(df, x, y){
    // x, y are strings
    // df is dataframe
    var xvals = new Array(df.length);
    var yvals = new Array(df.length);
    var i;
    for(i = 0; i<df.length; i++){
        xvals[i] = df[i][x];
        yvals[i] = df[i][y];
    }
    var plotInfo = {
        "data": [
            {
                "x": xvals,
                "y": yvals,
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
    var i;
    var j;
    // 2d array for all of the y data
    const yvals = [...new Array(df.length)].map(elem => new Array(yvars.length))
    var xvals = new Array(df.length);
    for(i = 0; i<df.length; i++){
        xvals[i] = df[i][xvar[0]];
        for(j = 0; j<yvars.length; j++){
            yvals[j][i] = df[i][yvars[j]];
        }
    }

    var traces = new Array(yvars.length);
    
    var trace;
    for(i = 0; i<yvars.length; i++){
        trace = {
            // FIXME: adjust for neat csv
            x : xvals,
            y : yvals[i],
            type : 'scatter',
            name : yvars[i]
        }
        traces[i] = trace;
    }
    var plotInfo = {
        "data" : traces,
        "layout": {
            font: {size: 18},
            title: yvars.toString() + " vs. " + xvars[0],
            xaxis: {
                title: xvars[0],
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
