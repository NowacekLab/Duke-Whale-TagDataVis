import React, { useState, useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

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
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    fontSize: "36px",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  selectButton: {
      marginTop: "20px",
      backgroundColor: "#012069",
      color: "white"
  }
};

function useIsMountedRef(){
  const isMountedRef = useRef(null);
  useEffect(() => {
      isMountedRef.current = true; 
      return () => isMountedRef.current = false; 
  })
  return isMountedRef;
}
  
const AppsTable = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  const isMountedRef = useIsMountedRef();

  const [update, setUpdate] = useState(false);
  const [fileSelection, setFileSelection] = useState(props.file ?? "");

  const handleClick = () => {
      props.fileSelector ? props.fileSelector(fileSelection) : null;
      props.closeModal();
  };

  return (

    <div style={styles.mainContainer}>
        <p style={styles.header}>Select a File</p>

        <FileTable selectedFile={fileSelection} selection={setFileSelection}/>

        <Button
                variant="contained"
                onClick={handleClick}
                style={styles.selectButton}
            >
                Confirm
        </Button>
    </div>
  );
};

AppsTable.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default AppsTable;

