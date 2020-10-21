/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AppsPage from "./containers/AppsPage";
import FilesPage from "./containers/FilesPage";
import Base from './containers/Base';
import Page2D from "./containers/Page2D";
import Page3D from "./containers/Page3D";
import PageMIX from "./containers/PageMIX";

export default function Routes() {
  return (
    <App>
      <Switch>

        <Route path={routes.APPS} // Base is base template, page is rendered alongside
        render={() => {
          return <Base Page={AppsPage} />
        }} />

        <Route path={routes.GRAPH2D}
        render={() => {
          return <Base Page={Page2D} />
        }} />

        <Route path={routes.GRAPH3D}
        render={() => {
          return <Base Page={Page3D} />
        }} />

        <Route path={routes.GRAPHMIX}
        render={() => {
          return <Base Page={PageMIX} />
        }} />

        <Route path={routes.FILES}
        render={() => {
          return <Base Page={FilesPage} />
        }} /> 




        

        <Route path={routes.HOME}
        render={() => {
          return <Base Page={HomePage} />
        }} /> 

      </Switch>
    </App>
  );
}
