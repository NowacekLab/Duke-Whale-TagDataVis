import React from "react";
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import AppLink from "./AppLink";
import routes from "../../routes.json";


export default function GraphLink() {


    return (
        <AppLink 
            to={routes.GRAPHS}
            Icon={GraphicEqIcon}
            title={"Graphs"}
        />
    )

}