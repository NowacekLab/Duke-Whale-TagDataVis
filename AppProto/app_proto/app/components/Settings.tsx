import React from 'react';
import PropTypes from "prop-types";
import Container from '@material-ui/core/Container';

const styles = {
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplateRows: "20% 80%",
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
};
  
const Settings = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  return (
    <Container style={rootStyle}>
      <p style={styles.header}>Settings</p>

      <div></div>

    </Container>
  );
};

Settings.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default Settings;