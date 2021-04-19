import React, { ReactNode, useEffect } from 'react';
import { Titlebar, Color } from 'custom-electron-titlebar';
const {remote} = require('electron');
const {Menu} = remote;
const path = require('path');

// Custom titlebar here
const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#012069'),
  titleHorizontalAlignment: 'center'
});
const menu = new Menu();
titlebar.updateMenu(menu);

type AppProps = {
  children: ReactNode;
};

export default function App(props: AppProps) {

  const settings = function(){

    const defaultSettings = {
      size: {
        width: 1142,
        height: 784,
      }
    }

    try {
      const strSettings = localStorage.getItem('settings') ?? "";
      const settings = JSON.parse(strSettings);
      return !settings || settings === "" ? defaultSettings : settings;
      
    } catch(error) {
      return defaultSettings;
    }
  }();

  useEffect(() => {

    const width = settings['size']['width'];
    const height = settings['size']['height'];
    remote.getCurrentWindow().setSize(width, height);

  }, [])
  
  const { children } = props;
  return <>{children}</>;
}
