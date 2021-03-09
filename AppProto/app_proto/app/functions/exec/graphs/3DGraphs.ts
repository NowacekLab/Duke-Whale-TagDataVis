//@ts-nocheck

const Quaternion = require('quaternion');
//ts-ignore
const Math = require("mathjs");
const Lodash = require('lodash'); 
// const slayer=require('slayer');

export const graphingFuncs3D = {
    "trackplot": trackplot,
    "trackplot_animated": trackplot_animated,
    "sideroll_poi": Sideroll,
}

type DataFrame = any;



// /**
//  * Plot jerk and jerk peaks with filtered/unfiltered option (by depth)
//  * Find peaks using slayer package
//  * 
//  * Currently write the output json object into a file named "./jerkpeak_output.json" 
//  * @param {string} filePath file path of the precalc file
//  * @param {int} depth_threshold in meters, any jerk less than given value will be set to 0.
//  * @param {int} min_peak_distance minimum distance between peaks (distance is # of x values in between peaks)
//  * @param {int} min_peak_height minimum peak height to be considered. Recommended to set to 0.
//  */

// const JerkPeak=(depth_threshold,min_peak_distance = 0,min_peak_height = 0)=>{
//     var datajson={
//         'data': [{'mode': 'lines',
//                   'name': 'Depth',
//                   'type': 'scattergl',
//                   'x': null,
//                   'xaxis': 'x2',
//                   'y': null,
//                   'yaxis': 'y2'},
//                  {'line': {'color': 'black'},
//                     'mode': 'lines',
//                   'name': 'Jerk',
//                   'type': 'scattergl',
//                   'x': null,
//                   'xaxis': 'x',
//                   'y': null,
//                   'yaxis': 'y'},
//                  {'mode': 'lines',
//                   'name': 'Jerk_filtered',
//                   'type': 'scattergl',
//                   'x': null,
//                   'xaxis': 'x',
//                   'y': null,
//                   'yaxis': 'y'},
//                  {'marker': {'color': 'lightskyblue', 'line': {'color': 'midnightblue', 'width': 2}, 'size': 5},
//                   'mode': 'markers',
//                   'name': 'Jerk_Peak',
//                   'type': 'scattergl',
//                   'x': null,
//                   'xaxis': 'x',
//                   'y': null,
//                   'yaxis': 'y'},
//                  {'marker': {'color': 'lightskyblue', 'line': {'color': 'midnightblue', 'width': 2}, 'size': 5},
//                   'mode': 'markers',
//                   'name': 'Jerk_Peak_filtered',
//                   'type': 'scattergl',
//                   'x': null,
//                   'xaxis': 'x',
//                   'y': null,
//                   'yaxis': 'y'}],
//         'layout': {'template': {
//             'data': {'bar': [{'error_x': {'color': '#2a3f5f'},
//                               'error_y': {'color': '#2a3f5f'},
//                               'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}},
//                               'type': 'bar'}],
//                      'barpolar': [{'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}}, 'type': 'barpolar'}],
//                      'carpet': [{'aaxis': {'endlinecolor': '#2a3f5f',
//                                            'gridcolor': 'white',
//                                            'linecolor': 'white',
//                                            'minorgridcolor': 'white',
//                                            'startlinecolor': '#2a3f5f'},
//                                  'baxis': {'endlinecolor': '#2a3f5f',
//                                            'gridcolor': 'white',
//                                            'linecolor': 'white',
//                                            'minorgridcolor': 'white',
//                                            'startlinecolor': '#2a3f5f'},
//                                  'type': 'carpet'}],
//                      'choropleth': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'choropleth'}],
//                      'contour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                   'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
//                                                  '#46039f'], [0.2222222222222222,
//                                                  '#7201a8'], [0.3333333333333333,
//                                                  '#9c179e'], [0.4444444444444444,
//                                                  '#bd3786'], [0.5555555555555556,
//                                                  '#d8576b'], [0.6666666666666666,
//                                                  '#ed7953'], [0.7777777777777778,
//                                                  '#fb9f3a'], [0.8888888888888888,
//                                                  '#fdca26'], [1.0, '#f0f921']],
//                                   'type': 'contour'}],
//                      'contourcarpet': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'contourcarpet'}],
//                      'heatmap': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                   'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
//                                                  '#46039f'], [0.2222222222222222,
//                                                  '#7201a8'], [0.3333333333333333,
//                                                  '#9c179e'], [0.4444444444444444,
//                                                  '#bd3786'], [0.5555555555555556,
//                                                  '#d8576b'], [0.6666666666666666,
//                                                  '#ed7953'], [0.7777777777777778,
//                                                  '#fb9f3a'], [0.8888888888888888,
//                                                  '#fdca26'], [1.0, '#f0f921']],
//                                   'type': 'heatmap'}],
//                      'heatmapgl': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                     'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
//                                                    '#46039f'], [0.2222222222222222,
//                                                    '#7201a8'], [0.3333333333333333,
//                                                    '#9c179e'], [0.4444444444444444,
//                                                    '#bd3786'], [0.5555555555555556,
//                                                    '#d8576b'], [0.6666666666666666,
//                                                    '#ed7953'], [0.7777777777777778,
//                                                    '#fb9f3a'], [0.8888888888888888,
//                                                    '#fdca26'], [1.0, '#f0f921']],
//                                     'type': 'heatmapgl'}],
//                      'histogram': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'histogram'}],
//                      'histogram2d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                       'colorscale': [[0.0, '#0d0887'],
//                                                      [0.1111111111111111, '#46039f'],
//                                                      [0.2222222222222222, '#7201a8'],
//                                                      [0.3333333333333333, '#9c179e'],
//                                                      [0.4444444444444444, '#bd3786'],
//                                                      [0.5555555555555556, '#d8576b'],
//                                                      [0.6666666666666666, '#ed7953'],
//                                                      [0.7777777777777778, '#fb9f3a'],
//                                                      [0.8888888888888888, '#fdca26'], [1.0,
//                                                      '#f0f921']],
//                                       'type': 'histogram2d'}],
//                      'histogram2dcontour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                              'colorscale': [[0.0, '#0d0887'],
//                                                             [0.1111111111111111,
//                                                             '#46039f'],
//                                                             [0.2222222222222222,
//                                                             '#7201a8'],
//                                                             [0.3333333333333333,
//                                                             '#9c179e'],
//                                                             [0.4444444444444444,
//                                                             '#bd3786'],
//                                                             [0.5555555555555556,
//                                                             '#d8576b'],
//                                                             [0.6666666666666666,
//                                                             '#ed7953'],
//                                                             [0.7777777777777778,
//                                                             '#fb9f3a'],
//                                                             [0.8888888888888888,
//                                                             '#fdca26'], [1.0, '#f0f921']],
//                                              'type': 'histogram2dcontour'}],
//                      'mesh3d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'mesh3d'}],
//                      'parcoords': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'parcoords'}],
//                      'pie': [{'automargin': true, 'type': 'pie'}],
//                      'scatter': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatter'}],
//                      'scatter3d': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
//                                     'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
//                                     'type': 'scatter3d'}],
//                      'scattercarpet': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattercarpet'}],
//                      'scattergeo': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergeo'}],
//                      'scattergl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergl'}],
//                      'scattermapbox': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattermapbox'}],
//                      'scatterpolar': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolar'}],
//                      'scatterpolargl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolargl'}],
//                      'scatterternary': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterternary'}],
//                      'surface': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
//                                   'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
//                                                  '#46039f'], [0.2222222222222222,
//                                                  '#7201a8'], [0.3333333333333333,
//                                                  '#9c179e'], [0.4444444444444444,
//                                                  '#bd3786'], [0.5555555555555556,
//                                                  '#d8576b'], [0.6666666666666666,
//                                                  '#ed7953'], [0.7777777777777778,
//                                                  '#fb9f3a'], [0.8888888888888888,
//                                                  '#fdca26'], [1.0, '#f0f921']],
//                                   'type': 'surface'}],
//                      'table': [{'cells': {'fill': {'color': '#EBF0F8'}, 'line': {'color': 'white'}},
//                                 'header': {'fill': {'color': '#C8D4E3'}, 'line': {'color': 'white'}},
//                                 'type': 'table'}]},
//             'layout': {'annotationdefaults': {'arrowcolor': '#2a3f5f', 'arrowhead': 0, 'arrowwidth': 1},
//                        'autotypenumbers': 'strict',
//                        'coloraxis': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
//                        'colorscale': {'diverging': [[0, '#8e0152'], [0.1, '#c51b7d'],
//                                                     [0.2, '#de77ae'], [0.3, '#f1b6da'],
//                                                     [0.4, '#fde0ef'], [0.5, '#f7f7f7'],
//                                                     [0.6, '#e6f5d0'], [0.7, '#b8e186'],
//                                                     [0.8, '#7fbc41'], [0.9, '#4d9221'], [1,
//                                                     '#276419']],
//                                       'sequential': [[0.0, '#0d0887'],
//                                                      [0.1111111111111111, '#46039f'],
//                                                      [0.2222222222222222, '#7201a8'],
//                                                      [0.3333333333333333, '#9c179e'],
//                                                      [0.4444444444444444, '#bd3786'],
//                                                      [0.5555555555555556, '#d8576b'],
//                                                      [0.6666666666666666, '#ed7953'],
//                                                      [0.7777777777777778, '#fb9f3a'],
//                                                      [0.8888888888888888, '#fdca26'], [1.0,
//                                                      '#f0f921']],
//                                       'sequentialminus': [[0.0, '#0d0887'],
//                                                           [0.1111111111111111, '#46039f'],
//                                                           [0.2222222222222222, '#7201a8'],
//                                                           [0.3333333333333333, '#9c179e'],
//                                                           [0.4444444444444444, '#bd3786'],
//                                                           [0.5555555555555556, '#d8576b'],
//                                                           [0.6666666666666666, '#ed7953'],
//                                                           [0.7777777777777778, '#fb9f3a'],
//                                                           [0.8888888888888888, '#fdca26'],
//                                                           [1.0, '#f0f921']]},
//                        'colorway': ['#636efa', '#EF553B', '#00cc96', '#ab63fa', '#FFA15A', '#19d3f3',
//                                     '#FF6692', '#B6E880', '#FF97FF', '#FECB52'],
//                        'font': {'color': '#2a3f5f'},
//                        'geo': {'bgcolor': 'white',
//                                'lakecolor': 'white',
//                                'landcolor': '#E5ECF6',
//                                'showlakes': true,
//                                'showland': true,
//                                'subunitcolor': 'white'},
//                        'hoverlabel': {'align': 'left'},
//                        'hovermode': 'closest',
//                        'mapbox': {'style': 'light'},
//                        'paper_bgcolor': 'white',
//                        'plot_bgcolor': '#E5ECF6',
//                        'polar': {'angularaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
//                                  'bgcolor': '#E5ECF6',
//                                  'radialaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
//                        'scene': {'xaxis': {'backgroundcolor': '#E5ECF6',
//                                            'gridcolor': 'white',
//                                            'gridwidth': 2,
//                                            'linecolor': 'white',
//                                            'showbackground': true,
//                                            'ticks': '',
//                                            'zerolinecolor': 'white'},
//                                  'yaxis': {'backgroundcolor': '#E5ECF6',
//                                            'gridcolor': 'white',
//                                            'gridwidth': 2,
//                                            'linecolor': 'white',
//                                            'showbackground': true,
//                                            'ticks': '',
//                                            'zerolinecolor': 'white'},
//                                  'zaxis': {'backgroundcolor': '#E5ECF6',
//                                            'gridcolor': 'white',
//                                            'gridwidth': 2,
//                                            'linecolor': 'white',
//                                            'showbackground': true,
//                                            'ticks': '',
//                                            'zerolinecolor': 'white'}},
//                        'shapedefaults': {'line': {'color': '#2a3f5f'}},
//                        'ternary': {'aaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
//                                    'baxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
//                                    'bgcolor': '#E5ECF6',
//                                    'caxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
//                        'title': {'x': 0.05},
//                        'xaxis': {'automargin': true,
//                                  'gridcolor': 'white',
//                                  'linecolor': 'white',
//                                  'ticks': '',
//                                  'title': {'standoff': 15},
//                                  'zerolinecolor': 'white',
//                                  'zerolinewidth': 2},
//                        'yaxis': {'automargin': true,
//                                  'gridcolor': 'white',
//                                  'linecolor': 'white',
//                                  'ticks': '',
//                                  'title': {'standoff': 15},
//                                  'zerolinecolor': 'white',
//                                  'zerolinewidth': 2}}
//         },
//         'xaxis': {'anchor': 'y', 'domain': [0.0, 1.0], 'matches': 'x2', 'showticklabels': false},
//         'xaxis2': {'anchor': 'y2', 'domain': [0.0, 1.0], 'rangeslider': {'visible': true}, 'title': {'text': 'Time (hr)'}},
//         'yaxis': {'anchor': 'x', 'domain': [0.575, 1.0],  'title': {'text': 'Jerk'}},
//         'yaxis2': {'anchor': 'x2',  'domain': [0.0, 0.425], 'autorange': 'reversed', 'title': {'text': 'Depth'}}
//     }
//     }
//     console.log("process data");
//     const df = {};
//     for (let idx in dataArr) {
//         const dataObj = dataArr[idx];
//         for (let header in dataObj) {
//             if (!(header === undefined || (typeof(header) === "string" && header.startsWith("Undefined") || header === ""))) {
//                 const val = dataObj[header];
//                 if (val) {
//                     if (!df.hasOwnProperty(header)) {
//                         df[header] = [];
//                     }
//                     df[header].push(val);
//                 }
//             }
//         }
//     }
//     //calculation
//     const decimation=10;
//     data_fs=df["fs"][0];
//     depth = Array.from(df["Depth"].filter((elem, index) => index % decimation === 0)).map(d=>parseFloat(d));
//     roll = df["Roll"].filter((elem, index) => index % decimation === 0).map(r=>r*(180/Math.pi));
//     jerk = df["Jerk"].filter((elem, index) => index % decimation === 0).map(j=>parseFloat(j));
//     time=Array.from(Array(depth.length).keys()).map(x=>(x/(data_fs/decimation))/3600);
//     jerk_filtered=Array.from(jerk.map((x,indx)=>{
//         if(depth[indx]>depth_threshold){
//             return x;
//         }else{
//             return 0;
//         }
//     }))
//     slayer({minPeakDistance:min_peak_distance,minPeakHeight:min_peak_height}).fromArray(jerk).then(spikes => {
//         // console.log(spikes)
//         datajson.data[3].x=Array.from(spikes.map(point=>time[point.x]));
//         datajson.data[3].y=Array.from(spikes.map(point=>point.y));
        
//         slayer({minPeakDistance:min_peak_distance,minPeakHeight:min_peak_height}).fromArray(jerk_filtered).then(spikes => {
//             datajson.data[4].x=Array.from(spikes.map(point=>time[point.x]));
//             datajson.data[4].y=Array.from(spikes.map(point=>point.y));
//             //insert data
//             datajson.data[0].x=time;
//             datajson.data[1].x=time;
//             datajson.data[2].x=time;
            

//             datajson.data[0].y=depth;
//             datajson.data[1].y=jerk;
//             datajson.data[2].y=jerk_filtered;

//         });
//     });
            
            
    
// };




function Sideroll(df: DataFrame){
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

            //calculation
    const decimation=10;
    let data_fs=df["fs"][0];
    let depth = df["Depth"].filter((elem: any, index: number) => index % decimation === 0);
    let roll = df["Roll"].filter((elem: any, index: number) => index % decimation === 0).map(r=>r*(180/Math.pi));
    let time=Array.from(Array(depth.length).keys()).map(x=>(x/(data_fs/decimation))/3600);
    let side_roll=roll.map(x=>{
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

    return datajson;
};



function trackplot_animated(df: DataFrame) {
    let lineInfo = {"color": "darkblue", "width": 0.5};
    let markerInfo = {'colorscale': [[0.0, '#440154'], [0.1111111111111111,
        '#482878'], [0.2222222222222222,
        '#3e4989'], [0.3333333333333333,
        '#31688e'], [0.4444444444444444,
        '#26828e'], [0.5555555555555556,
        '#1f9e89'], [0.6666666666666666,
        '#35b779'], [0.7777777777777778,
        '#6ece58'], [0.8888888888888888,
        '#b5de2b'], [1.0, '#fde725']],
        'size': 0.5};
    let typeInfo = "scatter3d";
    let meshMarkerBase = {"color": "red",
                        "opacity": 1,
                        "type": "mesh3d"};
    let dataJson = {"data": [],
                "layout": {
                "sliders": [{"x": 0.1, "y": 0, 'len': 0.9, 'pad':{'b': 10, 't': 60}, "steps":[]}],
                'scene': {'aspectmode': 'data',
                        'camera': {'eye': {'x': 0, 'y': 1.0707, 'z': 1}, 'up': {'x': 0, 'y': 0, 'z': 1}},
                        'xaxis': {"range":[], "autorange": false, 'title': {'text': 'X Displacement (m)'}},
                        'yaxis': {"range":[], "autorange": false, 'title': {'text': 'Y Displacement (m)'}},
                        'zaxis': {"range":[], "autorange": false, 'title': {'text': 'Z Displacement (m)'}},
                        'domain':{"x":[0, 1], "y":[0, 1]}},
                'template': {
                    'data': {'bar': [{'error_x': {'color': '#2a3f5f'},
                                    'error_y': {'color': '#2a3f5f'},
                                    'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}},
                                    'type': 'bar'}],
                            'barpolar': [{'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}}, 'type': 'barpolar'}],
                            'carpet': [{'aaxis': {'endlinecolor': '#2a3f5f',
                                                'gridcolor': 'white',
                                                'linecolor': 'white',
                                                'minorgridcolor': 'white',
                                                'startlinecolor': '#2a3f5f'},
                                        'baxis': {'endlinecolor': '#2a3f5f',
                                                'gridcolor': 'white',
                                                'linecolor': 'white',
                                                'minorgridcolor': 'white',
                                                'startlinecolor': '#2a3f5f'},
                                        'type': 'carpet'}],
                            'choropleth': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'choropleth'}],
                            'contour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'contour'}],
                            'contourcarpet': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'contourcarpet'}],
                            'heatmap': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'heatmap'}],
                            'heatmapgl': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                            'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                            'type': 'heatmapgl'}],
                            'histogram': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'histogram'}],
                            'histogram2d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                            'colorscale': [[0.0, '#0d0887'],
                                                            [0.1111111111111111, '#46039f'],
                                                            [0.2222222222222222, '#7201a8'],
                                                            [0.3333333333333333, '#9c179e'],
                                                            [0.4444444444444444, '#bd3786'],
                                                            [0.5555555555555556, '#d8576b'],
                                                            [0.6666666666666666, '#ed7953'],
                                                            [0.7777777777777778, '#fb9f3a'],
                                                            [0.8888888888888888, '#fdca26'], [1.0,
                                                            '#f0f921']],
                                            'type': 'histogram2d'}],
                            'histogram2dcontour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                                    'colorscale': [[0.0, '#0d0887'],
                                                                    [0.1111111111111111,
                                                                    '#46039f'],
                                                                    [0.2222222222222222,
                                                                    '#7201a8'],
                                                                    [0.3333333333333333,
                                                                    '#9c179e'],
                                                                    [0.4444444444444444,
                                                                    '#bd3786'],
                                                                    [0.5555555555555556,
                                                                    '#d8576b'],
                                                                    [0.6666666666666666,
                                                                    '#ed7953'],
                                                                    [0.7777777777777778,
                                                                    '#fb9f3a'],
                                                                    [0.8888888888888888,
                                                                    '#fdca26'], [1.0, '#f0f921']],
                                                    'type': 'histogram2dcontour'}],
                            'mesh3d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'mesh3d'}],
                            'parcoords': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'parcoords'}],
                            'pie': [{'automargin': true, 'type': 'pie'}],
                            'scatter': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatter'}],
                            'scatter3d': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                                            'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                                            'type': 'scatter3d'}],
                            'scattercarpet': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattercarpet'}],
                            'scattergeo': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergeo'}],
                            'scattergl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergl'}],
                            'scattermapbox': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattermapbox'}],
                            'scatterpolar': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolar'}],
                            'scatterpolargl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolargl'}],
                            'scatterternary': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterternary'}],
                            'surface': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'surface'}],
                            'table': [{'cells': {'fill': {'color': '#EBF0F8'}, 'line': {'color': 'white'}},
                                        'header': {'fill': {'color': '#C8D4E3'}, 'line': {'color': 'white'}},
                                        'type': 'table'}]},
                    'layout': {'annotationdefaults': {'arrowcolor': '#2a3f5f', 'arrowhead': 0, 'arrowwidth': 1},
                            'coloraxis': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                            'colorscale': {'diverging': [[0, '#8e0152'], [0.1, '#c51b7d'],
                                                            [0.2, '#de77ae'], [0.3, '#f1b6da'],
                                                            [0.4, '#fde0ef'], [0.5, '#f7f7f7'],
                                                            [0.6, '#e6f5d0'], [0.7, '#b8e186'],
                                                            [0.8, '#7fbc41'], [0.9, '#4d9221'], [1,
                                                            '#276419']],
                                            'sequential': [[0.0, '#0d0887'],
                                                            [0.1111111111111111, '#46039f'],
                                                            [0.2222222222222222, '#7201a8'],
                                                            [0.3333333333333333, '#9c179e'],
                                                            [0.4444444444444444, '#bd3786'],
                                                            [0.5555555555555556, '#d8576b'],
                                                            [0.6666666666666666, '#ed7953'],
                                                            [0.7777777777777778, '#fb9f3a'],
                                                            [0.8888888888888888, '#fdca26'], [1.0,
                                                            '#f0f921']],
                                            'sequentialminus': [[0.0, '#0d0887'],
                                                                [0.1111111111111111, '#46039f'],
                                                                [0.2222222222222222, '#7201a8'],
                                                                [0.3333333333333333, '#9c179e'],
                                                                [0.4444444444444444, '#bd3786'],
                                                                [0.5555555555555556, '#d8576b'],
                                                                [0.6666666666666666, '#ed7953'],
                                                                [0.7777777777777778, '#fb9f3a'],
                                                                [0.8888888888888888, '#fdca26'],
                                                                [1.0, '#f0f921']]},
                            'colorway': ["#636efa", "#EF553B", "#00cc96", "#ab63fa", "#FFA15A", "#19d3f3",
                            "#FF6692", "#B6E880", "#FF97FF", "#FECB52"],
                            'font': {'color': '#2a3f5f'},
                            'geo': {'bgcolor': 'white',
                                    'lakecolor': 'white',
                                    'landcolor': '#E5ECF6',
                                    'showlakes': true,
                                    'showland': true,
                                    'subunitcolor': 'white'},
                            'hoverlabel': {'align': 'left'},
                            'hovermode': 'closest',
                            'mapbox': {'style': 'light'},
                            'paper_bgcolor': 'white',
                            'plot_bgcolor': '#E5ECF6',
                            'polar': {'angularaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'bgcolor': '#E5ECF6',
                                        'radialaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
                            'scene': {'xaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'},
                                        'yaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'},
                                        'zaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'}},
                            'shapedefaults': {'line': {'color': '#2a3f5f'}},
                            'ternary': {'aaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'baxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'bgcolor': '#E5ECF6',
                                        'caxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
                            'title': {'x': 0.05},
                            'xaxis': {'automargin': true,
                                        'gridcolor': 'white',
                                        'linecolor': 'white',
                                        'ticks': '',
                                        'title': {'standoff': 15},
                                        'zerolinecolor': 'white',
                                        'zerolinewidth': 2},
                            'yaxis': {'automargin': true,
                                        'gridcolor': 'white',
                                        'linecolor': 'white',
                                        'ticks': '',
                                        'title': {'standoff': 15},
                                        'zerolinecolor': 'white',
                                        'zerolinewidth': 2}}
                },
                'width': 800},
            "frames":[]};
    dataJson.data.push({"line": lineInfo, "marker": markerInfo, "type": typeInfo, "x": null, "y": null, "z": null});
    dataJson.data.push({"line": lineInfo, "marker": markerInfo, "type": typeInfo, "x": null, "y": null, "z": null});
    const decimation = 50;
//Line Plot
    let x = df["X Position"].filter((elem: any, index: number) => index % decimation === 0);
    let y = df["Y Position"].filter((elem: any, index: number) => index % decimation === 0);
    let z = df["Z Position"].filter((elem: any, index: number) => index % decimation === 0);
    dataJson.data[1].x = x;
    dataJson.data[1].y = y;
    dataJson.data[1].z = z;
    dataJson.data[0].x = x;
    dataJson.data[0].y = y;
    dataJson.data[0].z = z
    dataJson.layout.scene.xaxis.range.push(Math.min(x) - 100, Math.max(x) + 100);
    dataJson.layout.scene.yaxis.range.push(Math.min(y) - 100, Math.max(y) + 100);
    dataJson.layout.scene.zaxis.range.push(Math.min(z) - 100, Math.max(z) + 100);

//Rotational Indicators
    let markX = x;
    let markY = y;
    let markZ = z;
    let markR = df['Roll'].filter((elem, index) => index % decimation === 0);
    let markP = df['Pitch'].filter((elem, index) => index % decimation === 0);
    let markH = df['Heading'].filter((elem, index) => index % decimation === 0);
    let axisVec = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
    //Set Default
    

    for(let i = 0; i < markX.length; i++){
        const rollQ = Quaternion.fromAxisAngle([1, 0, 0], markR[i]);
        const pitchQ = Quaternion.fromAxisAngle([0, 1, 0], markP[i]);
        const yawQ = Quaternion.fromAxisAngle([0, 0, 1], markH[i]);
        const rotateQ = yawQ.mul(pitchQ).mul(rollQ);
        
        let rotatedVec = [];
        for(let n of axisVec){
            rotatedVec.push(rotateQ.rotateVector(n));
        }
        let rotatedPt = [Math.multiply(rotatedVec[0], 200), Math.subtract(Math.multiply(rotatedVec[1], -70), Math.multiply(rotatedVec[0], 200)), Math.subtract(Math.multiply(rotatedVec[1], 70), Math.multiply(rotatedVec[0], 200))];
        let finalPt = [];
        for(let n of rotatedPt){
            finalPt.push(Math.add(n, [markY[i], markX[i], markZ[i]]));
        }
        let tempMeshDict = meshMarkerBase;
        tempMeshDict["x"] = finalPt.map(x => x[1]);
        tempMeshDict["y"] = finalPt.map(x => x[0]);
        tempMeshDict["z"] = finalPt.map(x => x[2]);
        dataJson.frames.push({"data":[Lodash.cloneDeep(tempMeshDict)], "name": String(i)});
        dataJson.layout.sliders[0].steps.push({'args': [[i], {'frame': {'duration': 0},
        'mode': 'immediate', 'fromcurrent':
        true, 'transition': {'duration': 0,
        'easing': 'linear'}}],
        'label': String(i),
        'method': 'animate'});
    }
    
    return dataJson;
}


function trackplot(df: DataFrame) {

    console.log("data frame: ");
    console.log(df);


    let lineInfo = {"color": "darkblue", "width": 0.5};
    let markerInfo = {'colorscale': [[0.0, '#440154'], [0.1111111111111111,
        '#482878'], [0.2222222222222222,
        '#3e4989'], [0.3333333333333333,
        '#31688e'], [0.4444444444444444,
        '#26828e'], [0.5555555555555556,
        '#1f9e89'], [0.6666666666666666,
        '#35b779'], [0.7777777777777778,
        '#6ece58'], [0.8888888888888888,
        '#b5de2b'], [1.0, '#fde725']],
        'size': 0.5};
    let typeInfo = "scatter3d";
    let meshMarkerBase = {"color": "red",
                        "opacity": 1,
                        "type": "mesh3d"};
    let dataJson: any = {"data": [],
                "layout": {
                'scene': {'aspectmode': 'data',
                        'camera': {'eye': {'x': 0, 'y': 1.0707, 'z': 1}, 'up': {'x': 0, 'y': 0, 'z': 1}},
                        'xaxis': {'title': {'text': 'X Displacement (m)'}},
                        'yaxis': {'title': {'text': 'Y Displacement (m)'}},
                        'zaxis': {'title': {'text': 'Z Displacement (m)'}}},
                'template': {
                    'data': {'bar': [{'error_x': {'color': '#2a3f5f'},
                                    'error_y': {'color': '#2a3f5f'},
                                    'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}},
                                    'type': 'bar'}],
                            'barpolar': [{'marker': {'line': {'color': '#E5ECF6', 'width': 0.5}}, 'type': 'barpolar'}],
                            'carpet': [{'aaxis': {'endlinecolor': '#2a3f5f',
                                                'gridcolor': 'white',
                                                'linecolor': 'white',
                                                'minorgridcolor': 'white',
                                                'startlinecolor': '#2a3f5f'},
                                        'baxis': {'endlinecolor': '#2a3f5f',
                                                'gridcolor': 'white',
                                                'linecolor': 'white',
                                                'minorgridcolor': 'white',
                                                'startlinecolor': '#2a3f5f'},
                                        'type': 'carpet'}],
                            'choropleth': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'choropleth'}],
                            'contour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'contour'}],
                            'contourcarpet': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'contourcarpet'}],
                            'heatmap': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'heatmap'}],
                            'heatmapgl': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                            'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                            'type': 'heatmapgl'}],
                            'histogram': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'histogram'}],
                            'histogram2d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                            'colorscale': [[0.0, '#0d0887'],
                                                            [0.1111111111111111, '#46039f'],
                                                            [0.2222222222222222, '#7201a8'],
                                                            [0.3333333333333333, '#9c179e'],
                                                            [0.4444444444444444, '#bd3786'],
                                                            [0.5555555555555556, '#d8576b'],
                                                            [0.6666666666666666, '#ed7953'],
                                                            [0.7777777777777778, '#fb9f3a'],
                                                            [0.8888888888888888, '#fdca26'], [1.0,
                                                            '#f0f921']],
                                            'type': 'histogram2d'}],
                            'histogram2dcontour': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                                    'colorscale': [[0.0, '#0d0887'],
                                                                    [0.1111111111111111,
                                                                    '#46039f'],
                                                                    [0.2222222222222222,
                                                                    '#7201a8'],
                                                                    [0.3333333333333333,
                                                                    '#9c179e'],
                                                                    [0.4444444444444444,
                                                                    '#bd3786'],
                                                                    [0.5555555555555556,
                                                                    '#d8576b'],
                                                                    [0.6666666666666666,
                                                                    '#ed7953'],
                                                                    [0.7777777777777778,
                                                                    '#fb9f3a'],
                                                                    [0.8888888888888888,
                                                                    '#fdca26'], [1.0, '#f0f921']],
                                                    'type': 'histogram2dcontour'}],
                            'mesh3d': [{'colorbar': {'outlinewidth': 0, 'ticks': ''}, 'type': 'mesh3d'}],
                            'parcoords': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'parcoords'}],
                            'pie': [{'automargin': true, 'type': 'pie'}],
                            'scatter': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatter'}],
                            'scatter3d': [{'line': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                                            'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                                            'type': 'scatter3d'}],
                            'scattercarpet': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattercarpet'}],
                            'scattergeo': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergeo'}],
                            'scattergl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattergl'}],
                            'scattermapbox': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scattermapbox'}],
                            'scatterpolar': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolar'}],
                            'scatterpolargl': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterpolargl'}],
                            'scatterternary': [{'marker': {'colorbar': {'outlinewidth': 0, 'ticks': ''}}, 'type': 'scatterternary'}],
                            'surface': [{'colorbar': {'outlinewidth': 0, 'ticks': ''},
                                        'colorscale': [[0.0, '#0d0887'], [0.1111111111111111,
                                                        '#46039f'], [0.2222222222222222,
                                                        '#7201a8'], [0.3333333333333333,
                                                        '#9c179e'], [0.4444444444444444,
                                                        '#bd3786'], [0.5555555555555556,
                                                        '#d8576b'], [0.6666666666666666,
                                                        '#ed7953'], [0.7777777777777778,
                                                        '#fb9f3a'], [0.8888888888888888,
                                                        '#fdca26'], [1.0, '#f0f921']],
                                        'type': 'surface'}],
                            'table': [{'cells': {'fill': {'color': '#EBF0F8'}, 'line': {'color': 'white'}},
                                        'header': {'fill': {'color': '#C8D4E3'}, 'line': {'color': 'white'}},
                                        'type': 'table'}]},
                    'layout': {'annotationdefaults': {'arrowcolor': '#2a3f5f', 'arrowhead': 0, 'arrowwidth': 1},
                            'coloraxis': {'colorbar': {'outlinewidth': 0, 'ticks': ''}},
                            'colorscale': {'diverging': [[0, '#8e0152'], [0.1, '#c51b7d'],
                                                            [0.2, '#de77ae'], [0.3, '#f1b6da'],
                                                            [0.4, '#fde0ef'], [0.5, '#f7f7f7'],
                                                            [0.6, '#e6f5d0'], [0.7, '#b8e186'],
                                                            [0.8, '#7fbc41'], [0.9, '#4d9221'], [1,
                                                            '#276419']],
                                            'sequential': [[0.0, '#0d0887'],
                                                            [0.1111111111111111, '#46039f'],
                                                            [0.2222222222222222, '#7201a8'],
                                                            [0.3333333333333333, '#9c179e'],
                                                            [0.4444444444444444, '#bd3786'],
                                                            [0.5555555555555556, '#d8576b'],
                                                            [0.6666666666666666, '#ed7953'],
                                                            [0.7777777777777778, '#fb9f3a'],
                                                            [0.8888888888888888, '#fdca26'], [1.0,
                                                            '#f0f921']],
                                            'sequentialminus': [[0.0, '#0d0887'],
                                                                [0.1111111111111111, '#46039f'],
                                                                [0.2222222222222222, '#7201a8'],
                                                                [0.3333333333333333, '#9c179e'],
                                                                [0.4444444444444444, '#bd3786'],
                                                                [0.5555555555555556, '#d8576b'],
                                                                [0.6666666666666666, '#ed7953'],
                                                                [0.7777777777777778, '#fb9f3a'],
                                                                [0.8888888888888888, '#fdca26'],
                                                                [1.0, '#f0f921']]},
                            'colorway': ["#636efa", "#EF553B", "#00cc96", "#ab63fa", "#FFA15A", "#19d3f3",
                            "#FF6692", "#B6E880", "#FF97FF", "#FECB52"],
                            'font': {'color': '#2a3f5f'},
                            'geo': {'bgcolor': 'white',
                                    'lakecolor': 'white',
                                    'landcolor': '#E5ECF6',
                                    'showlakes': true,
                                    'showland': true,
                                    'subunitcolor': 'white'},
                            'hoverlabel': {'align': 'left'},
                            'hovermode': 'closest',
                            'mapbox': {'style': 'light'},
                            'paper_bgcolor': 'white',
                            'plot_bgcolor': '#E5ECF6',
                            'polar': {'angularaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'bgcolor': '#E5ECF6',
                                        'radialaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
                            'scene': {'xaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'},
                                        'yaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'},
                                        'zaxis': {'backgroundcolor': '#E5ECF6',
                                                'gridcolor': 'white',
                                                'gridwidth': 2,
                                                'linecolor': 'white',
                                                'showbackground': true,
                                                'ticks': '',
                                                'zerolinecolor': 'white'}},
                            'shapedefaults': {'line': {'color': '#2a3f5f'}},
                            'ternary': {'aaxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'baxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''},
                                        'bgcolor': '#E5ECF6',
                                        'caxis': {'gridcolor': 'white', 'linecolor': 'white', 'ticks': ''}},
                            'title': {'x': 0.05},
                            'xaxis': {'automargin': true,
                                        'gridcolor': 'white',
                                        'linecolor': 'white',
                                        'ticks': '',
                                        'title': {'standoff': 15},
                                        'zerolinecolor': 'white',
                                        'zerolinewidth': 2},
                            'yaxis': {'automargin': true,
                                        'gridcolor': 'white',
                                        'linecolor': 'white',
                                        'ticks': '',
                                        'title': {'standoff': 15},
                                        'zerolinecolor': 'white',
                                        'zerolinewidth': 2}}
                },
                'width': 800}};
    dataJson.data.push({"line": lineInfo, "marker": markerInfo, "type": typeInfo, "x": null, "y": null, "z": null});
    //Line Plot
    let x = df["X Position"];
    let y = df["Y Position"];
    let z = df["Z Position"];
    dataJson.data[0].x = x;
    dataJson.data[0].y = y;
    dataJson.data[0].z = z;

//Rotational Indicators
    let markX = x.filter((elem: any, index: number) => index % 7500 === 0);
    let markY = y.filter((elem: any, index: number) => index % 7500 === 0);
    let markZ = z.filter((elem: any, index: number) => index % 7500 === 0);
    let markR = df['Roll'].filter((elem: any, index: number) => index % 7500 === 0);
    let markP = df['Pitch'].filter((elem: any, index: number) => index % 7500 === 0);
    let markH = df['Heading'].filter((elem: any, index: number) => index % 7500 === 0);
    let axisVec = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
    for(let i = 0; i < markX.length; i++){
        const rollQ = Quaternion.fromAxisAngle([1, 0, 0], markR[i]);
        const pitchQ = Quaternion.fromAxisAngle([0, 1, 0], markP[i]);
        const yawQ = Quaternion.fromAxisAngle([0, 0, 1], markH[i]);
        const rotateQ = yawQ.mul(pitchQ).mul(rollQ);
        
        let rotatedVec = [];
        for(let n of axisVec){
            rotatedVec.push(rotateQ.rotateVector(n));
        }
        let rotatedPt = [Math.multiply(rotatedVec[0], 200), Math.subtract(Math.multiply(rotatedVec[1], -70), Math.multiply(rotatedVec[0], 200)), Math.subtract(Math.multiply(rotatedVec[1], 70), Math.multiply(rotatedVec[0], 200))];
        let finalPt = [];
        for(let n of rotatedPt){
            finalPt.push(Math.add(n, [markY[i], markX[i], markZ[i]]));
        }
        let tempMeshDict: any = meshMarkerBase;

        //@ts-ignore
        tempMeshDict["x"] = finalPt.map(x => x[1]);
        //@ts-ignore
        tempMeshDict["y"] = finalPt.map(x => x[0]);
        //@ts-ignore
        tempMeshDict["z"] = finalPt.map(x => x[2]);

        //@ts-ignore
        dataJson.data.push(Lodash.cloneDeep(tempMeshDict));
    }
    
    return dataJson;
}
