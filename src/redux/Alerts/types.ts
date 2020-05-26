export interface AlertsState {
  apiResponseStatus: number
  title?: string
  message?: string
  timeout: number
  serviceWorkerRegistration?: string
}

export const ALERTS_SET_API_RESPONSE_STATUS = "ALERTS_SET_API_RESPONSE_STATUS"
export const ALERTS_SET_MESSAGE = "ALERTS_SET_MESSAGE"
export const ALERTS_CLEAR = "ALERTS_CLEAR"

export interface SetApiResponseStatusAction {
  type: typeof ALERTS_SET_API_RESPONSE_STATUS
  payload: number
}

export interface SetAlertAction {
  type: typeof ALERTS_SET_MESSAGE
  payload: string
}

export interface ClearAlertsAction {
  type: typeof ALERTS_CLEAR
}

export type AlertsActionTypes =
  | SetApiResponseStatusAction
  | SetAlertAction
  | ClearAlertsAction
