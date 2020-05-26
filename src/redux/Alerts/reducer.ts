import { AlertActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"
import { Reducer } from "redux"

export interface AlertsState {
  apiResponseStatus: number
  title?: string
  message?: string
  timeout: number
  serviceWorkerRegistration?: string
}

const DEFAULT_STATE_ALERTS: AlertsState = {
  apiResponseStatus: 404,
  title: "",
  message: "",
  timeout: 3000,
  serviceWorkerRegistration: undefined,
}

const Alerts: Reducer<AlertsState> = (
  state = DEFAULT_STATE_ALERTS,
  action
): AlertsState => {
  const { type, payload } = action
  switch (type) {
    case AlertActionTypes.ALERTS_SET_API_RESPONSE_STATUS:
      return { ...state, apiResponseStatus: payload }

    case AlertActionTypes.ALERTS_SET_MESSAGE:
      return { ...state, ...payload }

    case AlertActionTypes.ALERTS_CLEAR:
      return {
        ...DEFAULT_STATE_ALERTS,
        apiResponseStatus: state.apiResponseStatus,
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_ALERTS

    default:
      return state
  }
}

export { DEFAULT_STATE_ALERTS, Alerts }
