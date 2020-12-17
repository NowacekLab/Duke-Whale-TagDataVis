import React, { ReactNode } from 'react';

type AppProps = {
  children: ReactNode;
};

export default function App(props: AppProps) {
  
  const { children } = props;
  return <>{children}</>;
}
