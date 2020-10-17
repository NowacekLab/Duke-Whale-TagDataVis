import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container} from 'semantic-ui-react';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "30% 70%",
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
    link: {
        opacity: 1,
        textDecoration: "none",
    },
    app: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
    },
    app_hover: {
        color: "rgba(1,33,105)",
        fontSize: "11em",
        cursor: "pointer",
        backgroundColor: "rgba(0,0,0,0.1)",
        transition: "all 0.5s ease",
    },
    dock: {
        display: "flex",
        justifyContent: "space-around",
    },
    text: {
        color: "black",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: 200,
    }
};

const Apps = props => {
    const rootStyle = props.style 
    ? {...styles.root, ...props.style}
    : {...styles.root}

    // HOVER
    const [hover2D, setHover2D] = useState(false);
    const [hover3D, setHover3D] = useState(false);
    const [hoverMIX, setHoverMIX] = useState(false);

    const toggleHover2D = (e) => {
        setHover2D(!hover2D);
    };
    const toggleHover3D = (e) => {
        setHover3D(!hover3D);
    };
    const toggleHoverMIX = (e) => {
        setHoverMIX(!hoverMIX);
    };

    return (
            <Container fluid style={rootStyle} textAlign="center">
                <p style={styles.header}>Apps</p>
                <div style={styles.dock}>
                    <Link to={routes.GRAPH2D} style={styles.link}>
                        <TrendingUpIcon style={hover2D ? styles.app_hover : styles.app} onMouseEnter={toggleHover2D} onMouseLeave={toggleHover2D}>
                            <Link to={routes.GRAPH2D} />
                        </TrendingUpIcon>
                        <Typography style={styles.text}>
                                2D Graph
                        </Typography>
                    </Link>
                    <Link to={routes.GRAPH3D} style={styles.link}>
                        <GraphicEqIcon style={hover3D ? styles.app_hover : styles.app} onMouseEnter={toggleHover3D} onMouseLeave={toggleHover3D}/>
                        <Typography style={styles.text}>
                            3D Graph
                        </Typography>
                    </Link>
                    <Link to={routes.GRAPHMIX} style={styles.link}>
                        <MultilineChartIcon style={hoverMIX ? styles.app_hover : styles.app} onMouseEnter={toggleHoverMIX} onMouseLeave={toggleHoverMIX}/>
                        <Typography style={styles.text}>
                            Mixed
                        </Typography>
                    </Link>
                </div>
            </Container>
    );
};

// background-color: rgb(1, 33, 105);

{/* <AppsIcon style={{color:"white"}} fontSize="large"/> */}


// Home.propTypes = {
//     style: PropTypes.object, 
//     title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     children: PropTypes.object
// };

export default Apps;