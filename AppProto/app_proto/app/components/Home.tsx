import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import {Container, Icon} from "semantic-ui-react";

const styles = {
  root: {
      fontFamily: "HelveticaNeue-Light",
      height: "100%",
  },
  header: {
      color: "black",
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      fontSize: "36px",
  }
};

const Home = props => {
    const rootStyle = props.style 
    ? {...styles.root, ...props.style}
    : {...styles.root}

    return (
      <Container fluid style={rootStyle} textAlign="center">
          <p style={styles.header}>Home</p>
          <div>
              <Icon color="teal" name="chart line">

              </Icon>
          </div>
      </Container>
    );
};

Home.propTypes = {
    style: PropTypes.object, 
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.object
};

export default Home;