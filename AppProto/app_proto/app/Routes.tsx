/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './server/server_files/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AppsPage from "./containers/AppsPage";
import Base from './containers/Base';
import GraphsPage from './containers/GraphsPage';
import SettingsPage from "./containers/SettingsPage";
import InfoPage from "./containers/InfoPage";

export default function Routes() {
  return (
    <App>
      <Switch>

        <Route path={routes.APPS} // Base is base template, page is rendered alongside
        render={() => {
          return <Base Page={AppsPage} />
        }} />

        <Route path={routes.GRAPHS}
        render={() => {
          return <Base Page={GraphsPage} />
        }} />

        <Route path={routes.SETTINGS}
        render={() => {
          return <Base Page={SettingsPage} />
        }} />

        <Route path={routes.INFO}
        render={() => {
          return <Base Page={InfoPage} />
        }} />

        <Route path={routes.HOME}
        render={() => {
          return <Base Page={HomePage} />
        }} /> 

      </Switch>
    </App>
  );
}
