import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container, Icon} from "semantic-ui-react";
import path from "path";
import Plot from 'react-plotly.js';

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
class Comp3D extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            layout: {width: 800, height: 800, title: 'Test'},
            frames: [],
            config: {}
        };
    }

    render() {
        return (
            <Container fluid style={styles.root} textAlign="center">
                <p style={styles.header}>3D Graph</p>
                <Plot
                    data={this.state.data}
                    layout={this.state.layout}
                    frames={this.state.frames}
                    config={this.state.config}
                    style={styles.plot}
                />
            </Container>
        );
    }
}

// Home.propTypes = {
//     style: PropTypes.object, 
//     title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     children: PropTypes.object
// };

export default Comp3D;