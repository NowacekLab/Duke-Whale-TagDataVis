import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import FinishedUploads from "./FinishedUploads";

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
        width: "100%",
        fontWeight: 'normal',
        justifyContent: "flex-start",
        margin: 0,
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

    return (        
        <Paper
            elevation={3}
            className={classes.uploadPaper}
        >
            <h1
                className={classes.uploadPaperTitle}
            > 
                Batches
            </h1>
            
            <div
                className={classes.mainBody}
            >
                <FinishedUploads />
            </div>


        </Paper>

    );
};

export default Home;