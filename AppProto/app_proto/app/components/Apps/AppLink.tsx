import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import { Link, LinkProps } from 'react-router-dom';

const useStyles = makeStyles({
    link: {
        opacity: 1,
        textDecoration: "none",
    },
    linkIcon: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
    },
    linkIconHover: {
        color: "rgba(1,33,105)",
        fontSize: "10em",
        cursor: "pointer",
        backgroundColor: "rgba(0,0,0,0.1)",
        transition: "all 0.5s ease",
    },
    linkCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    linkTitle: {
        color: "black",
        fontSize: "20px",
        fontWeight: 200,
    },
});

type AppLinkProps = {
    to: string,     
    title: string,
    Icon: Function, 
    onClick?: LinkProps['onClick'], 
}

export default function AppLink(props: AppLinkProps) {

    const classes = useStyles(); 

    const [hovering, setHovering] = useState(false);

    const onMouseEnter = () => {
        setHovering(true);
    }

    const onMouseLeave = () => {
        setHovering(false);
    }

    return (
        <div
            className={classes.linkCont}
        >
            <Link to={props.to} onClick={props.onClick}>
                <props.Icon 
                    className={hovering ? classes.linkIconHover : classes.linkIcon}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                />
            </Link>

            <Typography className={classes.linkTitle}>
                {props.title}
            </Typography>
        </div>
    )

}