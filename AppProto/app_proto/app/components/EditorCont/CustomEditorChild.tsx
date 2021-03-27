import React from "react";
import {
    PanelMenuWrapper, 
    SingleSidebarItem, 
    Button,
    //@ts-ignore
} from 'react-chart-editor';

export default function CustomEditorChild() {

    return (
        <PanelMenuWrapper>
            <SingleSidebarItem>
                <Button 
                    variant = "primary"
                    label = "save"
                    onClick={() => console.log("SAVE")}
                />
            </SingleSidebarItem>
        </PanelMenuWrapper>
    )

}