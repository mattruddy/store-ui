import {
  ALERTS_SET_MESSAGE,
  ALERTS_SET_API_RESPONSE_STATUS,
  ALERTS_CLEAR,
} from "./types"

const setApiResponseStatus = (status: number) => ({
  type: ALERTS_SET_API_RESPONSE_STATUS,
  payload: status,
})

const setAlert = (message: string) => ({
  type: ALERTS_SET_MESSAGE,
  payload: message,
})

const clearAlerts = () => ({ type: ALERTS_CLEAR })

export { setApiResponseStatus, setAlert, clearAlerts }
