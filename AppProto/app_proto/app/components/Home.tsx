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
  },
  header2: {
    color: "black",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "left",
    fontSize: "30px",
  },
  header3: {
    color: "grey",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
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
  },
  listItem: {
    color: "black",
    textAlign: "left",
    fontSize: "10px",
  }

};



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const Home = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  const [files, setFiles] = useState([{ name: "Upload and display below" }])

  const addFile = (e) => {

    setFiles([...files, e.target.files[0]]);
    console.log(files[0].name)
  }

  //table
  const classes = useStyles();

  return (
    <Container fluid style={rootStyle} textAlign="center">
      <p style={styles.header}>Home</p>
      <p style={styles.header2}>Recently Opened</p>
      <div>
        <input type="file" name="file" onChange={addFile} />

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>File Name</StyledTableCell>
                <StyledTableCell align="right">File Path</StyledTableCell>
                <StyledTableCell align="right">File size</StyledTableCell>
                <StyledTableCell align="right">file type</StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <StyledTableRow key={file.name}>
                  <StyledTableCell component="th" scope="row">
                    {file.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{file.path}</StyledTableCell>
                  <StyledTableCell align="right">{file.size}</StyledTableCell>
                  <StyledTableCell align="right">{file.type}</StyledTableCell>
                </StyledTableRow>
              ))}
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
