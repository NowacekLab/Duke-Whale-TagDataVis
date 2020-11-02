import React from 'react';
import PropTypes from "prop-types";
import { Container } from "semantic-ui-react";

import HomeTable from "./HomeTable";

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
  header2: {
    color: "black",
    marginLeft: "1rem",
    marginRight: "auto",
    textAlign: "left",
    fontSize: "30px",

  },
  header3: {
    color: "grey",
    marginLeft: "10rem",
    textAlign: "left",
    fontSize: "25px",
  },
  link: {
    opacity: 1,
    textDecoration: "none",
  },
  app: {
    color: "rgba(1,33,105)",
    fontSize: "5em",
    cursor: "pointer",
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: "10px",
    //fontWeight: 200,
  },
  containerStyle: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplateRows: "30% 70%",
    gridTemplateColumns: "100%",
    gridTemplateAreas: `
    'main'`,
  },
  dock: {
    display: "flex",
    justifyContent: "left",
    margin:"2rem"
  },
  listItem: {
    color: "black",
    textAlign: "left",
    fontSize: "10px",
  },
  button:{
    opacity: "0",
  position: "absolute",
  width: "100px",
  height: "50px",
  //margin consistent
  marginLeft:"2rem"
  },
  label:{
    //button on label
    width: "100px",
    height: "50px",
    marginLeft: "2rem",
    color: "white",
    fontSize:'20px',
    backgroundColor:"rgba(1,33,105)"
  },
  tableContainer: {
    overflow: "scroll",
  },
  table: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  container: {
    maxHeight: 440,
  },
};

// 012069
  
const Home = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  return (
    <Container fluid style={rootStyle} textAlign="center">
      <p style={styles.header}>Home</p>

      <div style={styles.tableContainer}>
        <HomeTable />

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



/*
    <div>
         <input type="file" name="file" onChange={addFile} style={styles.button} />
         <label style={styles.label}> Upload </label>
      </div>
*/
