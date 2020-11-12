import React, { useState } from 'react';
import PropTypes from "prop-types";

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

    const [update, setUpdate] = useState(false);
    const [fileSelection, setFileSelection] = useState("");
    const [rows, setRows] = useState([]);

  const change = () => {
    setUpdate(!update);
  };

  const fileNumber = () => {
    switch (props.fileNum) { // fileNum is an indicator of loading for Home.tsx 
      case 0: 
        return `No Files`
      case 1:
        return `1 File`
      default:
        return `${props.fileNum} Files`
    }
  }

  return (

    <div style={styles.mainContainer}>
    
        <div style={styles.tableHeader}>
            <p style={styles.tableHeaderElem}>{fileNumber()}</p>
            <FileActions loading={props.loading ?? false} updater={change} selection={fileSelection} setLoading={props.setLoading ?? function fail(){return}} rows={rows}/>
        </div>

        <FileTable toUpdate={update} fileNum={props.setFileNum} selection={setFileSelection} setRows={setRows}/>

    </div>
  );
};

HomeTable.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default HomeTable;

