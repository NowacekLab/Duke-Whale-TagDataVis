import React from 'react';
import Graphs from '../components/Graphs';

export default function Page2D(props) {

  return <Graphs setLoading={props.setLoading ? props.setLoading : () => {return}} />;
}