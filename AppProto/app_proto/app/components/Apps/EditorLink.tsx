import React from "react";
import routes from "../../routes.json";
import AppLink from "./AppLink";
import EditIcon from '@material-ui/icons/Edit';

export default function EditorLink() {

    return (
        <AppLink 
            to={routes.EDITOR}
            Icon={EditIcon}
            title={"Editor"}
        />
    )


}