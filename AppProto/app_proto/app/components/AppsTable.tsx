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
      backgroundColor: "rgba(1,32,105,0.5)"
    }
  }
});

type AppsTableProps = {
  setSelectedGraphFile: Function, 
  selectedGraphFile: string,
  closeModal: Function,
}

const AppsTable = ({setSelectedGraphFile, selectedGraphFile, closeModal}: AppsTableProps) => {
  const classes = useStyles();

  const [selectedFile, setSelectedFile] = useState(selectedGraphFile ?? "");

  const handleClick = () => {
      setSelectedGraphFile ? setSelectedGraphFile(selectedFile) : null;
      closeModal ? closeModal() : null;
  };

  return (

    <div className={classes.root}>
        <p className={classes.header}>Select a File</p>

        <FileTable selectedFile={selectedGraphFile} setSelectedFile={setSelectedFile}/>

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

export default AppsTable;

