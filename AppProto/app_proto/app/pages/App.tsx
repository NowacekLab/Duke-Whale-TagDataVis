import React, { ReactNode } from 'react'
import { Titlebar, Color } from 'custom-electron-titlebar'

// Custom titlebar here
new Titlebar({
  backgroundColor: Color.fromHex('#012069')
});

type AppProps = {
  children: ReactNode;
};

export default function App(props: AppProps) {
  
  const { children } = props;
  return <>{children}</>;
}
