import React from 'react';
import Graphs from '../containers/Graphs';

type Page2DProps = {
  setLoading: Function
}

export default function Page2D({setLoading}: Page2DProps) {

  return <Graphs setLoading={setLoading ? setLoading : () => {return}} />;
}