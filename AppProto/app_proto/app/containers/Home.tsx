import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InitNotification from "../components/InitNotif";

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
});

const Home = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      
      <UploadsPaper />

      <InitNotification />

    </Container>
  );
};

export default Home;