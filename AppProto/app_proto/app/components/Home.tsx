import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import { Container, Icon } from "semantic-ui-react";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';
import Typography from '@material-ui/core/Typography';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MiniCssExtractPlugin } from 'mini-css-extract-plugin';

const styles = {
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplateRows: "10% 90%",
    gridTemplateColumns: "100%",
    gridTemplateAreas:`
    'header'
    'main'`,
},
  body: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: "20px",
    fontWeight: 200,
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

  }

};


// app: {
//   color: "rgba(1,33,105)",
//   fontSize: "10em",
//   cursor: "pointer",
// },
// app_hover: {
//   color: "rgba(1,33,105)",
//   fontSize: "11em",
//   cursor: "pointer",
//   backgroundColor: "rgba(0,0,0,0.1)",
//   transition: "all 0.5s ease",
// },


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgba(1,33,105)",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


// const StyledTableRow = withStyles((theme) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }))(TableRow);


const useStyles = makeStyles({
  table: {

    minWidth: 400,
    maxWidth:600

  },
  container:{
    //margin for the container
    margin: '2rem',
    overflow:"hidden",
    maxWidth:600
  }
});
//button
const useStyles_button = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: '2rem',
    },
  },
  input: {
    display: 'none',
    backgroundColor: 'rgba(1,33,105)',

  },
}));
const color_theme = createMuiTheme({
  palette: {
    primary: {
      // add color
      main: '#012069',
    },
  },
});




const Home = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

//{ name: "Upload and display below" }
  const [files, setFiles] = useState([])


  const { dialog } = require('electron');


    setFiles([...files, e.target.files[0]]);
    console.log(e.target.files[0])
  }

  //table
  const classes = useStyles();
 //button
 const classes_button = useStyles_button();
  return (
    <Container fluid style={rootStyle} textAlign="center">
      <p style={styles.header}>Home</p>
      <p style={styles.header2}>Recently Opened</p>

      <MuiThemeProvider theme={color_theme}>
      <div className={classes_button.root}>
      <input
        accept=".mat,.pdf"
        className={classes_button.input}
        id="contained-button-file"
        multiple
        onChange={addFile}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </div>
      </MuiThemeProvider>



      <div>


        <TableContainer component={Paper} className={classes.container} >
          <Table className={classes.table} >
            <TableHead>
              <TableRow className={classes.container}>
                <StyledTableCell>File Name</StyledTableCell>
                <StyledTableCell align="right">file type</StyledTableCell>
                <StyledTableCell align="right">Data Last Modified</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            { files.slice(Math.max(files.length - 3, 0)).map((file) => (
                <StyledTableRow key={file.name}>
                  <StyledTableCell component="th" scope="row">
                    {file.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{file.type}</StyledTableCell>
                  <StyledTableCell align="right">{file.lastModifiedDate.toDateString()}</StyledTableCell>
                </StyledTableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>


      </div>
      <p style={styles.header2}>Quick Access</p>
      <p style={styles.header3}>Apps</p>
      <div style={styles.dock}>
        <Link to={routes.GRAPH2D} style={styles.link}>
          <TrendingUpIcon style={styles.app}>
            <Link to={routes.GRAPH2D} />
          </TrendingUpIcon>
          <Typography style={styles.text}>
            2D Graph
                        </Typography>
        </Link>
        <Link to={routes.GRAPH3D} style={styles.link}>
          <GraphicEqIcon style={styles.app} />
          <Typography style={styles.text}>
            3D Graph
                        </Typography>
        </Link>
        <Link to={routes.GRAPHMIX} style={styles.link}>
          <MultilineChartIcon style={styles.app} />
          <Typography style={styles.text}>
            Mixed
                        </Typography>
        </Link>

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

