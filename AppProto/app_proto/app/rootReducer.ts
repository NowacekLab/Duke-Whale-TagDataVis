import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import notifsReducer from "./functions/notifs/notifsReducer";
import forceLoadReducer from "./functions/forceLoad/forceLoadReducer";
// eslint-disable-next-line import/no-cycle

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    notif: notifsReducer,
    forceLoad: forceLoadReducer,
  });
}
