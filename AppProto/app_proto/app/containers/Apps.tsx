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
    // modal: {
    //     position: "absolute",
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     background: "rgba(0,0,0,0.8)"
    // },
    // selectButton: {
    //     marginTop: "50px",
    //     backgroundColor: "#012069",
    //     width: "50%",
    //     marginLeft: "auto",
    //     marginRight: "auto",
    // },
});

const Apps = () => {
    const classes = useStyles();
    // const isMountedRef = useIsMountedRef();

    // //TODO: Convert to Redux 
    // const [selectedGraphFile, setSelectedGraphFile] = useState(localStorage.getItem('selectedGraphFile') || "");

    return (
            <Container className={classes.root}>
                <p className={classes.header}>Apps</p>
                <AppsNav />
            </Container>
    );
};

export default Apps;