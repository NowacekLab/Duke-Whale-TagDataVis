import React, { ReactNode } from 'react';
import { Titlebar, Color } from 'custom-electron-titlebar';
const {remote} = require('electron');
const {Menu} = remote;
const path = require('path');

// Custom titlebar here
const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#012069'),
  titleHorizontalAlignment: 'left'
});
const menu = new Menu();
titlebar.updateMenu(menu);

type AppProps = {
  children: ReactNode;
};

export default function App(props: AppProps) {
  
  const { children } = props;
  return <>{children}</>;
}
