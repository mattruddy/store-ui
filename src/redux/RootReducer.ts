import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, Alerts } from "./Alerts/reducer"
import { DEFAULT_STATE_APP, App } from "./App/reducer"
import { DEFAULT_STATE_USER, User } from "./User/reducer"
import { DEFAULT_STATE_PWAS, PWAs } from "./PWAs/reducer"
import { DEFAULT_STATE_WINDOW, Window } from "./Window/reducer"

const RootReducer = () =>
  combineReducers({
    Alerts,
    App,
    PWAs,
    User,
    Window,
  })

export {
  RootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_PWAS,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_WINDOW,
}
