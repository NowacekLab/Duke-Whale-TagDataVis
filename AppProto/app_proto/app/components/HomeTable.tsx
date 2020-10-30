import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import PropTypes from "prop-types";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import { chownSync } from 'fs';

import FileActions from "./FileActions";
import FileTable from "./FileTable";

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
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tableHeader: {
    width: "80%",
    display: "flex",
    justifyContent: "space-between",
  },
  tableHeaderElem: {
    alignSelf: "flex-end",
    color: "black"
  },
  tableHeaderButton: {
    height: "50px",
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
  
const HomeTable = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

    const [fileNum, setFileNum] = useState(0);
    const [update, setUpdate] = useState(false);
    const [fileSelection, setFileSelection] = useState("");

  const change = () => {
    setUpdate(!update);
  };

  return (

    <div style={styles.mainContainer}>
    
        <div style={styles.tableHeader}>
            <p style={styles.tableHeaderElem}>{fileNum} Files</p>

            <FileActions updater={change} selection={fileSelection}/>
        </div>

        <FileTable toUpdate={update} fileNum={setFileNum} selection={setFileSelection}/>

    </div>
  );
};

HomeTable.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default HomeTable;

