import {
  ALERTS_SET_API_RESPONSE_STATUS,
  ALERTS_CLEAR,
  ALERTS_SET,
  AlertsState,
} from "./types"

const setApiResponseStatus = (status: number) => ({
  type: ALERTS_SET_API_RESPONSE_STATUS,
  payload: status,
})

const setAlert = (data: Partial<AlertsState>) => ({
  type: ALERTS_SET,
  payload: data,
})

const clearAlerts = () => ({ type: ALERTS_CLEAR })

export { setApiResponseStatus, setAlert, clearAlerts }
