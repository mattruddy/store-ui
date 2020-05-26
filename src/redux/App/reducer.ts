import { AppActionTypes } from "./types"
import { ActionProps } from "../Actions/propTypes"
import { Reducer } from "redux"

export interface AppState {
  version: string
  localStorageUsage?: string
  localStorageQuota?: string
  localStorageUsageDetails?: string
}

const DEFAULT_STATE_APP: AppState = {
  version: new Number(1).toFixed(3),
  localStorageUsage: undefined,
  localStorageQuota: undefined,
  localStorageUsageDetails: undefined,
}

const App: Reducer<AppState> = (
  state = DEFAULT_STATE_APP,
  action
): AppState => {
  const { type, payload } = action
  switch (type) {
    case AppActionTypes.APP_SET_VERSION:
      return { ...state, version: payload.toFixed(3) }

    case AppActionTypes.REDUX_RESET:
      return state

    default:
      return state
  }
}

export { DEFAULT_STATE_APP, App }
