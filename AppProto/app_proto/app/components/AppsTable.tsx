import React, { useState } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

import FileTable from "./FileTable";

const useStyles = makeStyles({
  header: {
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "36px",
  },
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
  },
  selectButton: {
    marginTop: "20px",
    backgroundColor: "#012069",
    color: "white",
    "&:hover": {
      backgroundColor: "black",
      color: "white"
    }
  }
});

type AppsTableProps = {
  fileSelector: Function, 
  file: string,
  closeModal: Function,
}
const AppsTable = ({fileSelector, file, closeModal}: AppsTableProps) => {
  const classes = useStyles();

  const [fileSelection, setFileSelection] = useState(file ?? "");

  const handleClick = () => {
      fileSelector ? fileSelector(fileSelection) : null;
      closeModal ? closeModal() : null;
  };

  return (

    <div className={classes.root}>
        <p className={classes.header}>Select a File</p>

        <FileTable selectedFile={fileSelection} selection={setFileSelection}/>

        <Button
                variant="contained"
                onClick={handleClick}
                className={classes.selectButton}
            >
                Confirm
        </Button>
    </div>
  );
};

AppsTable.propTypes = {
  fileSelector: PropTypes.func,
  file: PropTypes.string,
  closeModal: PropTypes.func,
};

export default AppsTable;

