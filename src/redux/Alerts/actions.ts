import { AlertActionTypes } from "./types"
import { ActionProps } from "../Actions/propTypes"

const SetApiResponseStatus = (payload: ActionProps["payload"]) => ({
  type: AlertActionTypes.ALERTS_SET_API_RESPONSE_STATUS,
  payload,
})

const SetAlert = (payload: ActionProps["payload"]) => ({
  type: AlertActionTypes.ALERTS_SET_MESSAGE,
  payload,
})

const ClearAlerts = () => ({ type: AlertActionTypes.ALERTS_CLEAR })

export { SetApiResponseStatus, SetAlert, ClearAlerts }
