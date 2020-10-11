import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import styles from "./base.css";
import Sidebar from 'react-sidebar';
import SideBarContent from "../components/SideBarContent";

type Props = {
    Page: any;
  };

const sidebarStyles = {
    sidebar: {
        width: 200,
        background: "#012169"
    }
};

const sidebarProps = {
    sidebar: <SideBarContent />, 
    docked: true, 
    styles: sidebarStyles,
}

export default function Base({Page}: Props) {
    return ( 
        <Sidebar {...sidebarProps}>
            <Page />
        </Sidebar>
    )
}
