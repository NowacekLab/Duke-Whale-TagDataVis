import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import {createMuiTheme} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

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

function useIsMountedRef(){
  const isMountedRef = useRef(null);
  useEffect(() => {
      isMountedRef.current = true; 
      return () => isMountedRef.current = false; 
  })
  return isMountedRef;
}

  
const FileTable = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

    const isMountedRef = useIsMountedRef();

    useEffect(() => {
      generate();
    }, new Array(props.toUpdate));

    const [rows, setRows] = useState([]);
    const [choice, setChoice] = useState(props.selectedFile ? props.selectedFile : "");


    const isDev = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;


    const fs = window.require('fs');
    const path = require('path');
    const server_path = isDev ? path.resolve(path.join(__dirname, 'server')) : path.resolve(path.join(remote.app.getAppPath(), 'server'));
    const server_files = path.resolve(path.join(server_path, 'server_files'));
    const files = path.resolve(path.join(server_files, 'files.json'));

function createData(file, size, modified) {
  return { file, size, modified };
}

  async function generate() {
    fs.readFile(files, function(err, data) {

      const fileInfo = JSON.parse(data);
    
      const realRows = new Array(); 
      for (var key in fileInfo) {
        realRows.push(createData(key, fileInfo[key]["size"], fileInfo[key]["modified"]));
      }

      if (isMountedRef.current) {
        setRows(realRows);
        props.fileNum && props.fileNum(realRows.length);
        props.setRows && props.setRows(realRows);
      }
    })
  }
  const columns = [
    { id: "file", label: "File", minWidth: 170},
    { id: "size", label: "Size", minWidth: 100},
    { id: "modified", label: "Modified", minWidth: 100}
  ]

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const color = createMuiTheme({
      palette: {
          primary: {
              main: "#012069"
          }
      },
  });

  const handleChoice = (select) => {
      if (select === choice) {
          setChoice("");
          props.selection ? props.selection("") : null;
      } else {
           setChoice(select);
           props.selection ? props.selection(select) : null;
      }
  };

  return (

        <Paper style={styles.table}>
            <TableContainer style={styles.container}>
                <Table stickyHeader aria-label="sticky table" >
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth, backgroundColor: "#012069", color: 'white' }}
                        >
                        {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows && rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                        <TableRow 
                            hover 
                            role="checkbox" 
                            tabIndex={-1} 
                            key={row.file}
                            onClick={(e) => handleChoice(row.file)}
                            selected={choice === row.file}
                            className="override-hover"
                        >
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                            <TableCell 
                                key={column.id} 
                                align={column.align}
                            >
                                {column.id === "file" &&
                                    <Checkbox 
                                        checked={choice === row.file}
                                        style = {{
                                            color: '#012069'
                                        }}
                                    />}
                                {column.format && typeof value === 'number' ? column.format(value) : value}
                            </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                    })
                }
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[3]}
                component="div"
                count={rows ? rows.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
  );
};

FileTable.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default FileTable;