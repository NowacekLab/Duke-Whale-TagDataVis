/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes.json';
import App from './pages/App';
import HomePage from './pages/HomePage';
import Base from './pages/Base';
import GraphsPage from './pages/GraphsPage';
import EditorPage from "./pages/EditorPage";

export default function Routes() {
  return (
    <App>
      <Switch>

        <Route path={routes.GRAPHS}
        render={() => {
          return <Base Page={GraphsPage} />
        }} />

        <Route path={routes.EDITOR}
          render={() => {
          return <Base Page={EditorPage} />
        }} />
        
        <Route path={routes.HOME}
          render={() => {
          return <Base Page={HomePage} />
        }} /> 

      </Switch>
    </App>
  );
}
