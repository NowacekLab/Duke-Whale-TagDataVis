const app = require('electron').remote.app;

export function restartApp() {
  app.relaunch();
  app.exit();
}