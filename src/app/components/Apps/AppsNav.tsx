import React from "react"; 
import {makeStyles} from "@material-ui/core/styles";
import GraphLink from "./GraphLink";
import EditorLink from "./EditorLink";

const useStyles = makeStyles({
    appsNav: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "20%"
    },
})

export default function AppsNav() {

    const classes = useStyles();
    const appLinks = [GraphLink, EditorLink]

    return (
        <div
            className={classes.appsNav}
        >   
            {
                appLinks.map((AppLink) => {

                    return (
                        <AppLink />
                    )
                    
                })
            }
        </div>
    )


}