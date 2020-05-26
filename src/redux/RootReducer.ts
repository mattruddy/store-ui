import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, Alerts, AlertsState } from "./Alerts/reducer"
import { DEFAULT_STATE_APP, App } from "./App/reducer"
import { DEFAULT_STATE_USER, User } from "./User/reducer"
import { DEFAULT_STATE_PWAS, PWAs, PWAsState } from "./PWAs/reducer"
import { DEFAULT_STATE_WINDOW, Window, WindowState } from "./Window/reducer"
import { AppState } from "../data/state"
import { UserState } from "../data/user/user.state"

export interface ReduxState {
  alerts: AlertsState
  app: AppState
  pwas: PWAsState
  user: UserState
  window: WindowState
}

const RootReducer = combineReducers({
  alerts: Alerts,
  app: App,
  pwas: PWAs,
  user: User,
  window: Window,
})

export {
  RootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_PWAS,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_WINDOW,
}
