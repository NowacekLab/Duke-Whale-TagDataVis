

const Quaternion = require('quaternion');
const Math = require('mathjs');
const fs = require('fs');
const Lodash = require('lodash');
const neat = require('neat-csv');

const SideRoll=(filePath)=>{
    console.log("hay");
    var datajson={
        'data': [{'mode': 'lines',
                  'name': 'Depth',
                  'type': 'scattergl',
                  'x': null,
                  'xaxis': 'x',
                  'y': null,
                  'yaxis': 'y'},
                 {'line': {'color': 'black'},
                  'mode': 'lines',
                  'name': 'Roll',
                  'type': 'scattergl',
                  'x': null,
                  'xaxis': 'x2',
                  'y': null,
                  'yaxis': 'y2'},
                 {'line': {'color': 'red'},
                  'mode': 'lines',
                  'name': 'Side Roll(degree>40)',
                  'type': 'scattergl',
                  'x': null,
                  'xaxis': 'x2',
                  'y': null,
                  'yaxis': 'y2'}],
        'layout': {'template': '...',
                   'xaxis': {'anchor': 'y', 'domain': [0.0, 1.0], 'matches': 'x2', 'showticklabels': false},
                   'xaxis2': {'anchor': 'y2',
                              'domain': [0.0, 1.0],
                              'rangeslider': {'visible': true},
                              'title': {'text': 'Time (hr)'}},
                   'yaxis': {'anchor': 'x', 'autorange': 'reversed', 'domain': [0.575, 1.0], 'title': {'text': 'Depth'}},
                   'yaxis2': {'anchor': 'x2', 'domain': [0.0, 0.425], 'title': {'text': 'Roll (degree)'}}}
    }

    fs.readFile(filePath, function (err, data) {
        neat(data).then(dataArr => {
            const df = {};
            for (let idx in dataArr) {
                const dataObj = dataArr[idx];
                for (let header in dataObj) {
                    if (!(header === undefined || (typeof(header) === "string" && header.startsWith("Undefined") || header === ""))) {
                        const val = dataObj[header];
                        if (val) {
                            if (!df.hasOwnProperty(header)) {
                                df[header] = [];
                            }
                            df[header].push(val);
                        }
                    }
                }
            }
            //calculation
            const decimation=10;
            data_fs=df["fs"][0];
            depth = df["Depth"].filter((elem, index) => index % decimation === 0);
            roll = df["Roll"].filter((elem, index) => index % decimation === 0).map(r=>r*(180/Math.pi));
            time=Array.from(Array(depth.length).keys()).map(x=>(x/(data_fs/decimation))/3600);
            side_roll=roll.map(x=>{
                if(Math.abs(x)<40){
                    return NaN;
                }else{
                    return x;
                }
            })
            

            //insert data
            datajson.data[0].x=time;
            datajson.data[1].x=time;
            datajson.data[2].x=time;

            datajson.data[0].y=depth;
            datajson.data[1].y=roll;
            datajson.data[2].y=side_roll;


            var str = JSON.stringify(datajson);
            fs.writeFileSync("./sideRoll_output.json", str);
            

        })
    });








};

// SideRoll('precalc.csv');