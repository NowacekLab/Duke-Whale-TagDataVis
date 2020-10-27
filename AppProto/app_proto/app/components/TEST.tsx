import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container, Icon} from "semantic-ui-react";
import path from "path";
import Plot from 'react-plotly.js';
import * as Plotly from 'plotly.js';

const styles = {
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "10% 70%",
        gridTemplateColumns: "100%",
        gridTemplateAreas:`
        'header'
        'main'`,
    },
    header: {
        color: "black",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        fontSize: "36px",
    },
    plot: {
        marginLeft: "auto",
        marginRight: "auto",
    }
};

const Test = props => {

    const [data, setData] = useState([]);
    const [layout, setLayout] = useState({});

    Plotly.d3.csv(props.file, function(err,rows) {
        function unpack(rows, key) {
            return rows.map(function(row)
            { return row[key]; });}
        
        var trace2 = {
            x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
            mode: 'markers',
            marker: {
                color: 'rgb(127, 127, 127)',
                size: 4,
                symbol: 'circle',
                line: {
                color: 'rgb(204, 204, 204)',
                width: 1},
                opacity: 0.8},
            type: 'scatter3d'};
        
        var info = [trace2];

        setData(info);

        var lyt = {
            scene: {
                camera: {
                center: {
                    x: 1, y: 1, z: 1}, 
                eye: { 
                    x: 0, y: 0, z: 0}, 
                up: {
                    x: 0, y: 0, z: 1}
            },}
        };

        setLayout(lyt);

    });

    const testing = (e) => {
        console.log(e);
    }

    return (
        <Container fluid style={styles.root} textAlign="center">
            <p style={styles.header}>Mixed Graph</p>
            <Plot
                data={data}
                layout={layout}
                style={styles.plot}
                onClick={testing}
            />
        </Container>
    );

}


// class TEST extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             file: "",
//             data: [],
//             layout: {width: 800, height: 800, title: 'Test'},
//             frames: [],
//             config: {}
//         };
//         this.state.file = props.file; 
//     }

//     plotly.d3.csv(this.state.file, function(err, rows){
//         function unpack(rows, key) {
//             return rows.map(function(row)
//             { return row[key]; });}
        
//         var trace2 = {
//             x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
//             mode: 'markers',
//             marker: {
//                 color: 'rgb(127, 127, 127)',
//                 size: 12,
//                 symbol: 'circle',
//                 line: {
//                 color: 'rgb(204, 204, 204)',
//                 width: 1},
//                 opacity: 0.8},
//             type: 'scatter3d'};
        
//         this.state.data = [trace2];
//         this.state.layout = {
//             scene: {
//                 camera: {
//                 center: {
//                     x: 1, y: 1, z: 1}, 
//                 eye: { 
//                     x: 0, y: 0, z: 0}, 
//                 up: {
//                     x: 0, y: 0, z: 1}
//             },}
//         };
//     });

//     render() {
//         return (
//             <Container fluid style={styles.root} textAlign="center">
//                 <p style={styles.header}>Mixed Graph</p>
//                 <Plot
//                     data={this.state.data}
//                     layout={this.state.layout}
//                     frames={this.state.frames}
//                     config={this.state.config}
//                     style={styles.plot}
//                 />
//             </Container>
//         );
//     }
// }



// Home.propTypes = {
//     style: PropTypes.object, 
//     title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     children: PropTypes.object
// };

export default Test;