import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import useIsMountedRef from "../functions/useIsMountedRef";

const useStyles = makeStyles({
  table: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  container: {
    maxHeight: 440,
  },
});

type FileTableProps = {
  selectedFile?: string,
  setSelectedFile?: Function,
  updateTableView?: boolean, 
  fileNum?: Function, 
  setFileRows?: Function
}

const FileTable = (props: FileTableProps) => {
    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    useEffect(() => {
      generate();
    }, [props.updateTableView]);

    type Row = Record<string, string>;
    const [rows, setFileRows] = useState<Array<Row>>([]);
    const [choice, setChoice] = useState(props.selectedFile ? props.selectedFile : "");


    const isDev = process.env.NODE_ENV !== 'production';
    const remote = require('electron').remote;
    const fs = window.require('fs');
    const path = require('path');
    const scripts_path = isDev ? path.resolve(path.join(__dirname, 'scripts')) : path.resolve(path.join(remote.app.getAppPath(), 'scripts'));
    const scripts_files = path.resolve(path.join(scripts_path, 'scripts_files'));
    const files = path.resolve(path.join(scripts_files, 'files.json'));

    function createData(file: string, size: string, modified: string) {
    return { file, size, modified };
    }

    async function generate() {
      fs.readFile(files, function(err: string, data: string) {
        err;

        const fileInfo = JSON.parse(data);
      
        const realRows: Array<Row> = []; 
        for (var key in fileInfo) {
          realRows.push(createData(key, fileInfo[key]["size"], fileInfo[key]["modified"]));
        }

        if (isMountedRef.current) {
          setFileRows(realRows);
          props.fileNum && props.fileNum(realRows.length);
          props.setFileRows && props.setFileRows(realRows);
        }

      })
    }


    const columns = [
      { id: "file", label: "File", minWidth: 170},
      { id: "size", label: "Size", minWidth: 100},
      { id: "modified", label: "Modified", minWidth: 100}
    ]
    const [page, setPage] = useState(0);
    const [rowsPerPage, setFileRowsPerPage] = useState(3);

    const handleChangePage = (event: any, newPage: number) => {
      event;
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
      setFileRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleChoice = (select: string) => {
        if (select === choice) {
            setChoice("");
            props.setFileSelection ? props.setFileSelection("") : null;
        } else {
            setChoice(select);
            props.setFileSelection ? props.setFileSelection(select) : null;
        }
    };

    return (

          <Paper className={classes.table}>
              <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table" >
                  <TableHead>
                      <TableRow>
                      {columns.map((column) => (
                          <TableCell
                          key={column.id}
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
                              onClick={() => handleChoice(row.file)}
                              selected={choice === row.file}
                              className="override-hover"
                          >
                          {columns.map((column) => {
                              return (
                              <TableCell 
                                  key={column.id} 
                              >
                                  {column.id === "file" &&
                                      <Checkbox 
                                          checked={choice === row.file}
                                          style = {{
                                              color: '#012069'
                                          }}
                                      />}
                                  {row[column.id]}
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

export default FileTable;