import React from 'react';
import Sidebar from 'react-sidebar';
import SideBarContent from "../components/SideBarContent";

type Props = {
    Page: any;
};

export default function Base({Page}: Props) {

    return ( 
        <Sidebar 
            sidebar = {<SideBarContent/>}
            docked = {true}
        >
            <Page />
        </Sidebar>
    )
}
