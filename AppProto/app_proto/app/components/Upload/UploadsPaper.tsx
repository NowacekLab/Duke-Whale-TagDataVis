import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FinishedUploads from "./FinishedUploads";
import ProgressUploads from "./ProgressUploads";

const useStyles = makeStyles({
    uploadPaper: {
        height: "80%",
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        gap: "10px"
    },
    uploadPaperTitle: {
        fontWeight: "bold",
        width: "100%",
        justifyContent: "flex-start",
        margin: 0,
    },
    uploadTopBarContainer: {
        display: "flex",
        justifyContent: "flex-start",
        width: "100%"
    },
    uploadTabsContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px"
    },
    uploadTabInactive: {
        padding: 0,
        textTransform: "none"
    },
    uploadTabActive: {
        padding: 0,
        textTransform: "none",
        fontWeight: "bold"
    },
    mainBody: {
        width: "100%",
        height: "100%",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
});

const Home = () => {
    const classes = useStyles();

    const [tabVal, setTabVal] = useState(0);
    const handleChangeTab = (newTabVal: number) => {
        setTabVal(newTabVal);

        console.log("new tab val: ");
        console.log(newTabVal);
    }

    const finishedTabVal = 0;
    const progressTabVal = 1;
    const changeToFinishedTab = () => {
        handleChangeTab(finishedTabVal);
    }
    const changeToProgressTab = () => {
        handleChangeTab(progressTabVal);
    }
    const finishedTabActive = tabVal === finishedTabVal;
    const progressTabActive = tabVal === progressTabVal;

    return (        
        <Paper
            elevation={3}
            className={classes.uploadPaper}
        >
            <h1
                className={classes.uploadPaperTitle}
            > 
                Uploads
            </h1>

            <div
                className={classes.uploadTopBarContainer}
            >
                <div
                    className={classes.uploadTabsContainer}
                >

                    <Button
                        className={finishedTabActive ? classes.uploadTabActive : classes.uploadTabInactive}
                        onClick={changeToFinishedTab}
                    >
                        Finished 
                    </Button>

                    <Button
                        className={progressTabActive ? classes.uploadTabActive : classes.uploadTabInactive}
                        onClick={changeToProgressTab}
                    >
                        In Progress
                    </Button>

                </div>
            </div>
            
            <div
                className={classes.mainBody}
            >
                {
                    finishedTabActive &&
                    <FinishedUploads />
                }

                {
                    progressTabActive &&
                    <ProgressUploads />
                }


            </div>


        </Paper>

    );
};

export default Home;