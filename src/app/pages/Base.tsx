import React from 'react';
import SideBarContent from "../components/Sidebar/SideBarContent";
import Sidebar from "react-sidebar";
import InitNotification from "../components/InitNotif";
import NotifBtn from '../components/NotifBtn';

type Props = {
    Page: any;
};

export default function Base({Page}: Props) {

    return ( 
        <Sidebar
            sidebar={<SideBarContent />}
            docked={true}
        >
            <Page />

            <InitNotification />

            <NotifBtn />

        </Sidebar>
    )
}
