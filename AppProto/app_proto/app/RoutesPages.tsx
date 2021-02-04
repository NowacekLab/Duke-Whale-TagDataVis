/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './routes.json';
import App from './pages/App';
import HomePage from './pages/HomePage';
import AppsPage from "./pages/AppsPage";
import Base from './pages/Base';
import GraphsPage from './pages/GraphsPage';
import SettingsPage from "./pages/SettingsPage";
import InfoPage from "./pages/InfoPage";
import EditorPage from "./pages/EditorPage";
import UploadPage from "./pages/UploadPage";

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
