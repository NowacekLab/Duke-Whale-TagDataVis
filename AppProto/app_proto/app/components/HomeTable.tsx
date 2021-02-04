import React, { useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import FileActions from "./FileActions";
import FileTable from "./FileTable";

const useStyles = makeStyles({
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "100%",
    display: "grid",
    gridTemplatefileRows: "20% 80%",
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
    color: "black",
    fontWeight: "normal"
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
  setFileNum: Function,
  fileNum: number,
}

const HomeTable = ({setFileNum, fileNum}: HomeTableProps) => {
    const classes = useStyles();

    const [updateTableView, setUpdateTableView] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [fileRows, setFileRows] = useState([]);

  //TODO: change name, should reflect that it is refreshing FileTable
  const refreshTableView = () => {
    setUpdateTableView(!updateTableView);
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
        <FileTable updateTableView={updateTableView} fileNum={setFileNum} setSelectedFile={setSelectedFile} setFileRows={setFileRows}/>
    </div>
  );
};

export default HomeTable;

