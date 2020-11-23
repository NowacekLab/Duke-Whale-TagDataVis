import React, { useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import useIsMountedRef from "../functions/useIsMountedRef";

const useStyles = makeStyles({
    header: {
        color: "white",
        textAlign: "center",
        fontSize: "36px",
    },
    headersubtext: {
        marginTop: "5px"
    },
    loadertext: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "5px",
        flexDirection: "column"
    },
    loading: {
        display: "none",
        background: "rgba(0,0,0,0.9)",
        position: "fixed", 
        zIndex: 99998,
        bottom: 0,
        top: 0,
        right: 0,
        left: 200,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        },
    timelineCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    timelineContHead: {
        display: "flex",
        alignItems: "center"
    },
    finishButton: {
        marginTop: "20px",
        backgroundColor: "#012069",
        color: "white",
    },
    });

type UploadProgressProps = {
    uploadProgress: Record<string, string>,
    uploading: boolean,
    isUploading: boolean,
    finishedUpload: boolean, 
    loadingUpdateIncrement: number, 
    refresh: Function, 
    reset: Function, 
}

const UploadProgress = (props: UploadProgressProps) => {

    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    const handleLoading = () => {
        const loader = document.getElementById('loader');
        // props.uploading
        if (props.uploading) {
            loader ? loader.style.display = 'flex' : null;
        } else {
            loader ? loader.style.display = 'none' : null;
        }
    }

    const handleClick = () => {
        if (props.finishedUpload) {
            props.reset ? props.reset() : null;
            props.refresh ? props.refresh() : null; // connection from FileAction --> HomeTable --> FileTable to refresh rows 
        }
    }

    useEffect(() => {
        isMountedRef.current && handleLoading();
    }, [props.loadingUpdateIncrement])

    type timelineObject = Record<string, any>;
    const timeline: Array<timelineObject> = props.isUploading ? [
        {
            "key": 0,
            "show": props.uploadProgress ? props.uploadProgress['processed'] : "progress",
            "title": "Conversion",
            "description-success": "File converted to .csv as needed.",
            "description-progress": "Converting file to .csv as needed.",
            "description-fail": "Conversion failed."
        },
        {
            "key": 1, 
            "show": props.uploadProgress ? props.uploadProgress['graphs2D'] : "progress",
            "title": "2D Graphs",
            "description-success": "2D Graphs generated.",
            "description-progress": "Generating 2D Graphs.",
            "description-fail": "2D Graph generation failed."
        },
        {
            "key": 2, 
            "show": props.uploadProgress ? props.uploadProgress['graphs3D'] : "progress",
            "title": "3D Graphs",
            "description-success": "3D Graphs generated.",
            "description-progress": "Generating 3D Graphs.",
            "description-fail": "3D Graph generation failed."
        },
    ] : [
        {
            "key": 1, 
            "show": props.uploadProgress ? props.uploadProgress['graphs2D'] : "progress",
            "title": "2D Graphs",
            "description-success": "2D Graphs generated.",
            "description-progress": "Generating 2D Graphs.",
            "description-fail": "2D Graph generation failed."
        },
        {
            "key": 2, 
            "show": props.uploadProgress ? props.uploadProgress['graphs3D'] : "progress",
            "title": "3D Graphs",
            "description-success": "3D Graphs generated.",
            "description-progress": "Generating 3D Graphs.",
            "description-fail": "3D Graph generation failed."
        },
    ]

    const description = (item: timelineObject) => {
        let choice = `description-${item['show']}`
        if (item.hasOwnProperty(choice)) {
            return item[choice];
        } else {
            return item['description-progress'];
        }
    }

  return (
          <div className={classes.loading} id="loader">
            <div className={classes.loadertext}>
              <span className={classes.header}>This may take a while</span>
              <span className={classes.headersubtext}>Do not close the page</span>
            </div>
            <div style={{width: "100%"}}>
                <Timeline>
                    {timeline.map((item) => {

                        return(
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />

                                    {item['title'] === "3D Graphs" ?
                                        <div style={{display: "none"}}></div>

                                        :

                                        <TimelineConnector />
                                    }

                                </TimelineSeparator>

                                <TimelineContent>
                                    <div className={classes.timelineCont}>
                                        <div className={classes.timelineContHead}>
                                            <p style={{fontSize: "18px", margin:0, padding:0}}>{item['title']}</p>
                                            {
                                                item['show'] === 'success' && 
                                                <Fade in={item['show'] === 'success'} timeout={500}>
                                                    <DoneIcon style={{marginLeft: "5px", color: "green"}}/> 
                                                </Fade>
                                            }
                                            {
                                                item['show'] === 'progress' && 
                                                <CircularProgress style={{width: "15px", height: "15px", marginLeft: "5px", color: "white"}} />
                                            }
                                            {
                                                item['show'] === 'fail' &&
                                                <Fade in={item['show'] === 'fail'} timeout={500}>
                                                    <CloseIcon style={{marginLeft: "5px", color: "red"}}/> 
                                                </Fade>
                                            }
                                        </div>
                                        <div>
                                            <p style={{fontSize: "15px"}}>
                                                {description(item)}
                                            </p>
                                        </div>

                                    </div>

                                </TimelineContent>

                            </TimelineItem>
                        )

                    })}
                </Timeline>


                <div style={{width: "100%", display: "flex", justifyContent: "center", opacity: props.finishedUpload ? 1 : 0}}>
                    <Fade in={props.finishedUpload} timeout={500}>
                        <Button className={classes.finishButton} onClick={handleClick}>
                            Done
                        </Button>
                    </Fade>
                </div>
                
            

            </div>
          </div>
  );

};

export default UploadProgress;
