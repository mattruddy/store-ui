import {
  AppActionTypes,
  APP_SET_VERSION,
  REDUX_RESET,
  AppState,
  SET_HAS_UPDATE,
} from "./types"

const DEFAULT_STATE_APP: AppState = {
  version: (1).toFixed(3),
  localStorageUsage: "",
  localStorageQuota: "",
  localStorageUsageDetails: "",
  hasUpdate: false,
}

const appReducer = (state = DEFAULT_STATE_APP, action: AppActionTypes) => {
  switch (action.type) {
    case APP_SET_VERSION:
      return { ...state, version: action.payload.toFixed(3) }

    case SET_HAS_UPDATE:
      return { ...state, hasUpdate: true }

    case REDUX_RESET:
      return state

    default:
      return state
  }
}

export { DEFAULT_STATE_APP, appReducer }
