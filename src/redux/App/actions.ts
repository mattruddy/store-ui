import { AppActionTypes } from "./types"
import { WindowActionTypes } from "../Window/types"
import axios from "axios"
import ReactGA from "react-ga"
import { ActionProps } from "../Actions/propTypes"
import { MiddlewareAPI } from "redux"
const { PUBLIC_URL } = process.env

const SetWindow = (payload: ActionProps["payload"]) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

const ResetRedux = () => (dispatch: MiddlewareAPI["dispatch"]) =>
  dispatch({ type: AppActionTypes.REDUX_RESET })

const GetAppVersion = () => (
  dispatch: MiddlewareAPI["dispatch"],
  getState: MiddlewareAPI["getState"]
) => {
  const {
    App: { version },
  } = getState()
  return axios
    .get(`${PUBLIC_URL}/version.txt`)
    .then(({ data }) => {
      dispatch({ type: AppActionTypes.APP_SET_VERSION, payload: data })
      ReactGA.event({
        category: "Check App Version",
        action: "User got the latest app version!",
        value: data,
      })

      return { currentVersion: version, latestVersion: data }
    })
    .catch(({ response }) => console.log("ERROR: ", response))
}

export { SetWindow, ResetRedux, GetAppVersion }
