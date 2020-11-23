import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';

import HomeTable from "../components/HomeTable";

const useStyles = makeStyles({
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
});
  
type HomeProps = {
  loading: boolean,
  setLoading: Function
}

const Home = ({loading, setLoading}: HomeProps) => {
  const classes = useStyles();

  const [fileNum, setFileNum] = useState(-1);

  const handleLoading = () => {
    const loaderSmaller = document.getElementById('loader-smaller');
    const loadingTable = document.getElementById('loading-table');
    const homeTable = document.getElementById('home-table');

    if (fileNum > -1) {
      setTimeout(() => {
        loaderSmaller ? loaderSmaller.style.display = "none" : null;
        loadingTable ? loadingTable.style.display="none" : null;
        homeTable ? homeTable.style.display = "block" : null;
      }, 300)
    }
  }

  useEffect(() => {
    handleLoading();
  }, [fileNum]);

  return (
    <Container className={classes.root}>
      <p className={classes.header}>{"Home"}</p>

      <LinearProgress id="loader-smaller" color="primary" className={classes.loadingSmaller}/>

      <div className={classes.table} id="loading-table">
        <Skeleton variant="text" width="100%" height={30} />
        <Skeleton variant="rect" height={500} />
      </div>

      <div className={classes.tableContainer} id="home-table">
        <HomeTable loading={loading ?? false} fileNum={fileNum} setFileNum={setFileNum} setLoading={setLoading ?? function fail(){return}}/>

      </div>
    </Container>
  );
};

export default Home;