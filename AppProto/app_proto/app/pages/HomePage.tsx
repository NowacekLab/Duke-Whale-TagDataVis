import React from 'react';
import Home from '../containers/Home';

type HomePageProps = {
  setLoading: Function, 
  loading: boolean,
}

export default function HomePage({setLoading, loading}: HomePageProps) {
  return <Home loading={loading ?? false} setLoading={setLoading ?? function fail(){return;}} />;
}
