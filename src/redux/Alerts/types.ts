export interface AlertsState {
  apiResponseStatus: number
  title: string
  message: string
  timeout: number
  show: boolean
  serviceWorkerRegistration: string
  status: "success" | "fail" | undefined
}

export const ALERTS_SET_API_RESPONSE_STATUS = "ALERTS_SET_API_RESPONSE_STATUS"
export const ALERTS_SET_MESSAGE = "ALERTS_SET_MESSAGE"
export const ALERTS_CLEAR = "ALERTS_CLEAR"
export const ALERTS_SET = "ALERTS_SET"

export interface SetApiResponseStatusAction {
  type: typeof ALERTS_SET_API_RESPONSE_STATUS
  payload: number
}

export interface SetAlertMessageAction {
  type: typeof ALERTS_SET_MESSAGE
  payload: string
}

export interface ClearAlertsAction {
  type: typeof ALERTS_CLEAR
}

export interface SetAlertAction {
  type: typeof ALERTS_SET
  payload: Partial<AlertsState>
}

export type AlertsActionTypes =
  | SetApiResponseStatusAction
  | SetAlertMessageAction
  | ClearAlertsAction
  | SetAlertAction
