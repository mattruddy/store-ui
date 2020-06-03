import { combineReducers } from "redux"
import { DEFAULT_STATE_ALERTS, alertsReducer } from "./Alerts/reducer"
import { DEFAULT_STATE_APP, appReducer } from "./App/reducer"
import { DEFAULT_STATE_USER, userReducer } from "./User/reducer"
import { DEFAULT_STATE_PWAS, pwasReducer } from "./PWAs/reducer"
import { DEFAULT_STATE_WINDOW, windowReducer } from "./Window/reducer"

const rootReducer = combineReducers({
  alerts: alertsReducer,
  app: appReducer,
  pwas: pwasReducer,
  user: userReducer,
  window: windowReducer,
})

export type ReduxCombinedState = ReturnType<typeof rootReducer>

export {
  rootReducer,
  DEFAULT_STATE_ALERTS,
  DEFAULT_STATE_APP,
  DEFAULT_STATE_PWAS,
  DEFAULT_STATE_USER,
  DEFAULT_STATE_WINDOW,
}
