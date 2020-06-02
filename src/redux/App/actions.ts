import { APP_SET_VERSION, REDUX_RESET } from "./types"
import axios from "axios"
import ReactGA from "react-ga"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { SET_WINDOW } from "../Window/types"
import { ReduxCombinedState } from "../RootReducer"
const { PUBLIC_URL } = process.env

const setWindow = (payload: any) => ({
  type: SET_WINDOW,
  payload,
})

const thunkResetRedux = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action<string>
> => async (dispatch) => dispatch({ type: REDUX_RESET })

const setAppVersion = (data: any) => ({
  type: APP_SET_VERSION,
  payload: data,
})

const getAppVersion = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action<string>
> => async (dispatch, getState) => {
  const {
    app: { version },
  } = getState()
  try {
    const { data } = await axios.get(`${PUBLIC_URL}/version.txt`)
    dispatch(setAppVersion(data))
    ReactGA.event({
      category: "Check App Version",
      action: "User got the latest app version!",
      value: data,
    })
    return {
      currentVersion: version,
      latestVersion: data,
    } as ComparableVersions
  } catch ({ response }) {
    return console.error("ERROR: ", response)
  }
}

interface ComparableVersions {
  currentVersion: number
  latestVersion: number
}

export { setWindow, thunkResetRedux, getAppVersion }
