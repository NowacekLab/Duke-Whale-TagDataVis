import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem'; 
import TimelineSeparator from '@Material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AssessmentIcon from '@material-ui/icons/Assessment';
import EditIcon from '@material-ui/icons/Edit';
import RepeatIcon from '@material-ui/icons/Repeat';

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
  accordionDetailMultiple: {
    display: "flex",
    justifyContent: "center",
  }
};
  
const Info = props => {
  const rootStyle = props.style
    ? { ...styles.root, ...props.style }
    : { ...styles.root }

  // information in title:content format 
  const information = [
    {
      "title": "Summary of features",
      "description": `On the 'Home' page, files can be uploaded, and then
      deleted permanently, manually edited, saved to a folder in downloads specified
      in settings, and/or reprocessed for all its graphs. On the 'Apps' page, a processed
      file can be selected, graphs of a graph type available for that file can be viewed,
      and these graphs can be deleted permanently and/or saved to a folder in downloads specified
      in settings. Each graph has additional features available upon opening.`
    },
    {
      "title": "What are .csv and .html files?",
      "description": `CSV stands for 'Comma Separated Values,' and it is, as the name
      suggests, a file of values separated by commas. It is a widely used format that
      is compatible with programs such as Excel and is often used as data sets for
      creating visualizations. HTML stands for 'Hypertext Markup Language' and it is 
      used to construct web pages even today. When graphs are saved, they are saved as 
      .html files as they are fully contained, offline-compatible web pages that have a
      graph and features available for that graph. They can be drag and dropped from the
      file explorer on your system into the URL bar of most any browser and, upon clicking enter,
      can be seen. All of the features available for each graph will be equally available when
      visualizing it using your own browser and the .html file.`
    },
    {
      "title": "Why do buttons not work sometimes?",
      "description": `The most likely reason is that an action has already been requested at that time.
      In that case the application prevents additional actions for safety. In rare cases it may be technical difficulties (see below).`
    },
    {
      "title": "What if there are serious technical difficulties?",
      "description": `If you have tried your best to deal with them, including restarting the application,
      and it appears to be a problem internally with the application, then please contact the main supervisor (see credits)
      for this application to get things sorted out.`
    },
    {
      "title": "Credits",
      "description": `The primary supervisor of this application was Dr. Nowacek of Duke University. The developers were
      Joon Young Lee, Vincent Wang, Mitchell Frisch, Delaney Demark, and Danny Zeping Luo, all of whom were Duke University
      students at the time of development.`
    }
  ]

  const timeline = [
    {
      "title": "Upload",
      "description": `Upload a .mat or .csv file on 'Home' page.
       Graphs will automatically be processed for you.`,
      "icon": <CloudUploadIcon />
    },
    {
      "title": "Visualize",
      "description": `Select a graph type on 'Apps' page and
        easily visualize the processed graphs.`,
      "icon": <AssessmentIcon />
    },
    {
      "title": "Edit",
      "description": `On several pages there are additional
      functionalities available to empower your choice.`,
      "icon": <EditIcon />
    },
    {
      "title": "Repeat",
      "description": `Repeat the steps above. Upload more files. Get
      clear visualizations fast. Edit to your heart's content.`,
      "icon": <RepeatIcon />,
      "place": "last"
    }
  ]

  return (
    <Container style={rootStyle}>
      <p style={styles.header}>Info</p>
      <div style={styles.bodyContainer}>
        <Accordion style={styles.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon style={{color: "white"}}/>}
          >
            <Typography>General Use Case</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Timeline align="alternate">
              {timeline.map((obj) => {
                return (
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot color="primary" variant="outlined">
                        {obj['icon']}
                      </TimelineDot>
                      <TimelineConnector style={{display: obj.hasOwnProperty("place") ? "none" : ""}}/>
                    </TimelineSeparator>
                    <TimelineContent style={{color: "white"}}>
                        <Typography variant="h6" component="h1">
                          {obj['title']}
                        </Typography>
                        <p style={{fontSize: "15px"}}>{obj['description']}</p>
                    </TimelineContent>
                  </TimelineItem>
                )
              })}
            </Timeline>
          </AccordionDetails>
        </Accordion>

        {information.map((obj) => {
          return (
            <Accordion style={styles.accordion}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{color: "white"}} />}
              >
                <Typography>{obj['title']}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p style={{fontSize: "16px"}}>
                  {obj['description']}
                </p>
              </AccordionDetails>
            </Accordion>
          )
        })}

      </div>

    </Container>
  );
};

Info.propTypes = {
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.object
};

export default Info;