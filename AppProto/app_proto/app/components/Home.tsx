import React, {useState, useEffect} from 'react';
import PropTypes from "prop-types";
// import { Container } from "semantic-ui-react";
import Container from '@material-ui/core/Container';

import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

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
    display: "none"
  },
  table: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  container: {
    maxHeight: 440,
  },
  loadingSmaller : {
    display: "flex",
    position: "fixed",
    zIndex: 99998,
    top: 0,
    left: 200, 
    right: 0,
    height: 5,
  }
};
  
const Home = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  const [fileNum, setFileNum] = useState(-1);

  const handleLoading = () => {
    const loaderSmaller = document.getElementById('loader-smaller');
    const loadingTable = document.getElementById('loading-table');
    const homeTable = document.getElementById('home-table');

    if (fileNum > -1) {
      setTimeout(() => {
        loaderSmaller ? loaderSmaller.style.display = "none" : "";
        loadingTable ? loadingTable.style.display="none" : "";
        homeTable ? homeTable.style.display = "block" : "";
      }, 300)
    }
  }

  useEffect(() => {
    handleLoading();
  }, [fileNum]);

  return (
    <Container style={rootStyle}>
      <p style={styles.header}>Home</p>

      <LinearProgress id="loader-smaller" color="primary" style={styles.loadingSmaller}/>

      <div style={styles.table} id="loading-table">
        <Skeleton variant="text" width="100%" height={30} />
        <Skeleton variant="rect" height={500} />
      </div>

      <div style={styles.tableContainer} id="home-table">
        <HomeTable loading={props.loading ? props.loading : () => {return}} fileNum={fileNum} setFileNum={setFileNum} setLoading={props.setLoading ? props.setLoading : () => {return}}/>

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
