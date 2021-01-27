import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useIsMountedRef from "../functions/useIsMountedRef";
import Fab from "@material-ui/core/Fab";
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import ListIcon from '@material-ui/icons/List';
import HomeTable from "../components/HomeTable";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import UploadsPaper from "../components/Upload/UploadsPaper";

const useStyles = makeStyles({
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  uploadPaper: {
    height: "80%",
    width: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    gap: "10px"
  },
  uploadPaperTitle: {
    fontSize: "2em",
    fontWeight: "bold",
    width: "100%",
    justifyContent: "flex-start",
    margin: 0,
  },
  uploadTopBarContainer: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%"
  },
  uploadTabsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px"
  },
  uploadTabInactive: {
    padding: 0,
    textTransform: "none"
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
  loadingSmaller : {
    display: "flex",
    position: "fixed",
    zIndex: 99998,
    top: 0,
    left: 200, 
    right: 0,
    height: 5,
  },
  hide: {
    display: "none"
  },
  show: {
    display: ""
  }
});

const Home = () => {
  const classes = useStyles();

  // TODO: was originally -1, changed for testing
  const [fileNum, setFileNum] = useState(0);

  const isMountedRef = useIsMountedRef();

  const handleLoading = () => {
    const loaderSmaller = document.getElementById('loader-smaller');
    const loadingTable = document.getElementById('loading-table');
    const homeTable = document.getElementById('home-table');

    if (fileNum > -1) {
      setTimeout(() => {
        if (isMountedRef.current) {
          loaderSmaller ? loaderSmaller.style.display = "none" : null;
          loadingTable ? loadingTable.style.display="none" : null;
          homeTable ? homeTable.style.display = "block" : null;
        }
      }, 300)
    }
  }

  useEffect(() => {
    if (isMountedRef.current) {
      handleLoading();
    }
  }, [fileNum]);


  const [tabVal, setTabVal] = useState(0);
  const handleChange = (event: any, newValue: any) => {
    setTabVal(newValue);
  }


  return (
    <Container className={classes.root}>
      
      <UploadsPaper />


    </Container>
  );
};

export default Home;