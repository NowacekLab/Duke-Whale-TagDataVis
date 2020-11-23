import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import FileActions from "./FileActions";
import FileTable from "./FileTable";

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
});
  

type HomeTableProps = {
  loading: boolean, 
  setLoading: Function, 
  setFileNum: Function,
  fileNum: number,
}

const HomeTable = ({loading, setLoading, setFileNum, fileNum}: HomeTableProps) => {
    const classes = useStyles();

    const [update, setUpdate] = useState(false);
    const [fileSelection, setFileSelection] = useState("");
    const [rows, setRows] = useState([]);

  const refresh = () => {
    setUpdate(!update);
  };

  const fileNumber = () => {
    switch (fileNum) { // fileNum is an indicator of loading for Home.tsx 
      case 0: 
        return `No Files`
      case 1:
        return `1 File`
      default:
        return `${fileNum} Files`
    }
  }

  return (

    <div className={classes.mainContainer}>
    
        <div className={classes.tableHeader}>
            <p className={classes.tableHeaderElem}>{fileNumber()}</p>
            <FileActions loading={loading ?? false} refresh={refresh} selection={fileSelection} setLoading={setLoading ?? function fail(){return}} rows={rows}/>
        </div>

        <FileTable toUpdate={update} fileNum={setFileNum} selection={setFileSelection} setRows={setRows}/>

    </div>
  );
};

export default HomeTable;

