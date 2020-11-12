import React from 'react';
import Home from '../components/Home';

export default function HomePage(props) {
  return <Home setLoading={props.setLoading ? props.setLoading : () => {return}} />;
}
