import React, { useEffect, useState } from 'react';
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
import useIsMountedRef from "../../functions/useIsMountedRef";

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
        left: 100,
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
        "&:hover": {
            backgroundColor: "rgba(1,32,105,0.5)"
        }
    },
    });

type UploadProgressProps = {
    uploadProgress: any,
    uploading: boolean,
    onFinish: Function,
}

const UploadProgress = (props: UploadProgressProps) => {

    const classes = useStyles();

    const isMountedRef = useIsMountedRef();

    const [finishedUploading, setFinishedUploading] = useState(false);
    const updateUploadStatus = () => {

        let uploadFinished = true; 
        for (let key in props.uploadProgress) {
            if (props.uploadProgress[key] === 'progress') {
                uploadFinished = false;
            }
        }
        setFinishedUploading(uploadFinished);
    }

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
        if (finishedUploading) {
            props.onFinish();
        }
    }

    useEffect(() => {
        isMountedRef.current && handleLoading();
    }, [props.uploading])

    useEffect(() => {

        console.log("In upload progress");

        updateUploadStatus();
    }, [props.uploadProgress])

    type timelineObject = Record<string, any>;

    // const defaultUploadProgress: uploadProgress = {
    //     processing: "progress",
    //     generating: "progress",
    //     saving: "progress"
    // }


    var timeline: Array<timelineObject> = [
        {
            "key": 0,
            "show": props.uploadProgress ? props.uploadProgress['processing'] : "progress",
            "title": "Processing",
            "description-success": "Chosen data file processed successfully.",
            "description-progress": "Processing chosen data file.",
            "description-fail": "Failed processing chosen data file."
        },
        {
            "key": 1,
            "show": props.uploadProgress ? props.uploadProgress['generating'] : "progress",
            "title": "Generating",
            "description-success": "Sucessfully generated graphs and required files.",
            "description-progress": "Generating graphs and required files.",
            "description-fail": "Failed generating graphs."
        },
        {
            "key": 2, 
            "show": props.uploadProgress ? props.uploadProgress['saving'] : "progress",
            "title": "Saving",
            "description-success": "Successfully saved processed files.",
            "description-progress": "Saving processed files.",
            "description-fail": "Failed saving processed files."
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
                <span className={classes.header}>This will take a while</span>
                <span className={classes.headersubtext}>Do not close the page</span>
            </div>
            <div style={{width: "100%"}}>
                <Timeline>
                    {timeline.map((item) => {

                        return(
                            <TimelineItem>
                                <TimelineSeparator>
                                    <TimelineDot />

                                    {item['title'] === "Graphs" ?
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


                <div style={{width: "100%", display: "flex", justifyContent: "center", opacity: finishedUploading ? 1 : 0}}>
                    <Fade in={finishedUploading} timeout={500}>
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
