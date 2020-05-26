import {
  AlertsActionTypes,
  ALERTS_SET_API_RESPONSE_STATUS,
  ALERTS_SET_MESSAGE,
  ALERTS_CLEAR,
  AlertsState,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"

const DEFAULT_STATE_ALERTS: AlertsState = {
  apiResponseStatus: 404,
  title: "",
  message: "",
  timeout: 3000,
  serviceWorkerRegistration: undefined,
}

const alertsReducer = (
  state = DEFAULT_STATE_ALERTS,
  action: AlertsActionTypes | AppActionTypes
): AlertsState => {
  switch (action.type) {
    case ALERTS_SET_API_RESPONSE_STATUS:
      return { ...state, apiResponseStatus: action.payload }

    case ALERTS_SET_MESSAGE:
      return { ...state, message: action.payload }

    case ALERTS_CLEAR:
      return {
        ...DEFAULT_STATE_ALERTS,
        apiResponseStatus: state.apiResponseStatus,
      }

    case REDUX_RESET:
      return DEFAULT_STATE_ALERTS

    default:
      return state
  }
}

export { DEFAULT_STATE_ALERTS, alertsReducer }
