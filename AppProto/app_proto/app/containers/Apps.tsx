import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppsNav from "../components/Apps/AppsNav";

const useStyles = makeStyles({
    root: {
        fontFamily: "HelveticaNeue-Light",
        height: "100%",
        display: "grid",
        gridTemplateRows: "30% 70%",
        gridTemplateColumns: "100%",
        gridTemplateAreas:`
        'header'
        'main'`,
    },
    header: {
        color: "black",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "36px",
    },
});

const Apps = () => {
    const classes = useStyles();

    return (
            <Container className={classes.root}>
                <p className={classes.header}>Apps</p>
                <AppsNav />
            </Container>
    );
};

export default Apps;