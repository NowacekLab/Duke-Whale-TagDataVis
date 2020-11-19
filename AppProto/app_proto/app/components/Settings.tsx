import React, { useState } from 'react';
import PropTypes from "prop-types";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    fontFamily: "HelveticaNeue-Light",
    height: "90%",
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
  bodyContainer: {
    padding: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%"
  },
  accordion: {
    backgroundColor: "#012067",
    color: "white",
    marginBottom: "10px",
  },
  subBody: {
    display: "flex",
    flexDirection: "column",
    margin: "20px",
    alignItems: "center"
  },
  subBodyTitle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  subBodyFieldCont: {
    display: "flex",
  },
  subBodyField: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "10px"
  },
  subHeader: {
    marginTop: "20px",
    color: "white",
  },
  textField: {
    '& .MuiInputBase-input': {
      color: '#fff', // Text color
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#fff8', // Semi-transparent underline
    },
    '& .MuiInput-underline:hover:before': {
      borderBottomColor: '#fff', // Solid underline on hover
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fff', // Solid underline on focus
    },
    marginBottom: "10px",
  },
  input: {
    color: "white",
    borderColor: "white",
    fontSize: "15px"
  },
  confirmButtonCont: {
    display: "flex",
    justifyContent: "center"
  },
  confirmButton: {
    marginTop: "20px",
    backgroundColor: "transparent",
    color: "white",
    '&:hover': {
      backgroundColor: 'white',
      color: "black"
    }
}
};
  
const Settings = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  const { classes } = props;

  // reset to defaults 

  const sizes = [
    {
      value: 'fullscreen',
      label: 'Fullscreen',
    },
    {
      value: 'fullwindowed',
      label: 'Full Window',
    },
    {
      value: 'windowed',
      label: 'Default',
    }
  ]

  const resets = [
    {
      value: 'everything',
      label: 'Everything',
    },
    {
      value: 'graphs',
      label: 'Graphs',
    },
    {
      value: 'files',
      label: 'Files',
    },
    {
      value: 'settings',
      label: 'Settings',
    }
  ]

  const [downloadDirectory, setDownloadDirectory] = useState('data_visualization');
  const handleDownloadDirectory = (e) => {
    setDownloadDirectory(e.target.value);
  }

  const [size, setSize] = useState('windowed');
  const handleChange = (e) => {
    setSize(e.target.value);
  }
  const handleClick = () => {
    console.log("no");
  }

  const [reset, setReset] = useState('everything');
  const handleReset = (e) => {
    setReset(e.target.value);
  }

  return (
    <Container style={rootStyle}>
      <p style={styles.header}>Settings</p>

      <div className={classes.bodyContainer}>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
          >
            <Typography>General Settings</Typography>
          </AccordionSummary>
          <AccordionDetails style={{display: "flex", flexDirection: "column"}}>

            <div className={classes.subBody}>
              <div className={classes.subBodyTitle}>
                <Typography variant="h5">Download Directory</Typography>
              </div>
              <div className={classes.subBodyField}>
                <TextField 
                  value={downloadDirectory}
                  onChange={handleDownloadDirectory}
                  className={classes.textField}
                  InputProps={{
                    className: classes.input
                  }}
                />
                <Typography variant="caption" align="center" style={{width: "80%"}}>This is the name of the directory in your downloads folder where all your downloads will be saved.</Typography>
              </div>
            </div>

            <div className={classes.subBody}>
              <div className={classes.subBodyTitle}>
                <Typography variant="h5">Window Sizes</Typography>
              </div>
              <div className={classes.subBodyFieldCont}>
                <div className={classes.subBodyField}>
                  <div>
                    <TextField
                        select
                        value={size}
                        onChange={handleChange}
                        className={classes.textField}
                        InputProps={{
                          className: classes.input
                        }}
                      >
                        {sizes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                  </div>
                  <Typography variant="caption" align="center">App Window</Typography>
                </div>  
                <div className={classes.subBodyField}>
                  <div>
                    <TextField
                        select
                        value={size}
                        onChange={handleChange}
                        className={classes.textField}
                        InputProps={{
                          className: classes.input
                        }}
                      >
                        {sizes.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                  </div>
                  <Typography variant="caption" align="center">Graph Window</Typography>
                </div>             
              </div>

            </div>

          <div className={classes.confirmButtonCont}>
            <Button
                  variant="contained"
                  onClick={handleClick}
                  className={classes.confirmButton}
              >
                  Confirm
            </Button>
          </div>


          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
          >
            <Typography>Reset</Typography>
          </AccordionSummary>
          <AccordionDetails style={{display: "flex", flexDirection: "column"}}>

          <div className={classes.subBody}>
            <div className={classes.subBodyTitle}>
              <Typography variant="h5">I want to reset...</Typography>
            </div>
            <div className={classes.subBodyFieldCont}>
                  <div className={classes.subBodyField}>
                    <div>
                      <TextField
                          select
                          value={reset}
                          onChange={handleReset}
                          className={classes.textField}
                          InputProps={{
                            className: classes.input
                          }}
                        >
                          {resets.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                    </div>
                  </div>  
            </div>
          </div>
          
          <div className={classes.confirmButtonCont}>
            <Button
                  variant="contained"
                  onClick={handleClick}
                  className={classes.confirmButton}
              >
                  Reset
            </Button>
          </div>

          </AccordionDetails>
        </Accordion>
      
      </div>
   


    </Container>
  );
};

Settings.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default withStyles(styles) (Settings);