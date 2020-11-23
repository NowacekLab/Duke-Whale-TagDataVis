import React, {useState} from 'react';
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

export default function Base({Page}: Props) {

    const [loading, setLoading] = useState(false); // disable navigation when action taken 

    const sidebarProps = {
        sidebar: <SideBarContent loading={loading} />, 
        docked: true, 
        styles: sidebarStyles,
    }

    return ( 
        <Sidebar {...sidebarProps}>
            <Page setLoading={setLoading} loading={loading}/>
        </Sidebar>
    )
}
