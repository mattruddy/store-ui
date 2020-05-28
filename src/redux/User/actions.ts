import {
  UserState,
  USER_SET_LOADING,
  USER_SET_DATA,
  USER_SET_PWAS,
  USER_REPLACE_APP,
  USER_ADD_APP,
  USER_REMOVE_APP,
  USER_HAS_READ_INSTALL,
  UserRole,
} from "./types"
import { PWA } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import {
  getUserData,
  setHasReadInstallStorage,
  setEmailStorage,
  setTokenStorage,
  setUsernameStorage,
  setIsLoggedInStorage,
  Axios,
  setRoleStorage,
} from "../Actions"
import { setAlert } from "../Alerts/actions"

export const thunkLoadUserData = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action
> => async (dispatch) => {
  dispatch(setLoading(true))
  const data = await getUserData()
  dispatch(setData(data))
  dispatch(setLoading(false))
}

export const thunkLogin = (
  username: string,
  password: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const url = `public/login`
    const response = await (await Axios()).post(url, { username, password })
    const {
      data: { token },
    } = response

    // TODO: do this in the api.
    var role = UserRole.Dev
    if (username === "mattruddy") {
      role = UserRole.Admin
    }
    dispatch(setData({ token, username, isLoggedIn: true }))
    await setRoleStorage(UserRole.Admin.toString())
    await setTokenStorage(token)
    await setUsernameStorage(username)
    await setIsLoggedInStorage("true")
    dispatch(setAlert({ message: "Succuess", timeout: 3000, show: true }))
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
      })
    )
    return console.log(e)
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkLoadProfile = (
  token: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const url = `secure/profile`
    const resp = await (await Axios()).get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const {
      data: { username, pwas, email },
    } = resp
    dispatch(
      setData({
        email,
        username,
        pwas,
      })
    )
    await setEmailStorage(email)
    await setUsernameStorage(username)
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
      })
    )
    return console.error(e)
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkSetUser = (
  username: string,
  email: string = "",
  token: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  dispatch(
    setData({
      token,
      email,
      username,
      isLoggedIn: true,
    })
  )
  await setEmailStorage(email)
  await setTokenStorage(token)
  await setUsernameStorage(username)
  await setIsLoggedInStorage("true")
  dispatch(setLoading(false))
}

export const thunkLogout = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action
> => async (dispatch) => {
  dispatch(setLoading(true))
  dispatch(
    setData({
      token: "",
      email: "",
      username: "",
      isLoggedIn: false,
      pwas: [],
    })
  )
  await setEmailStorage("")
  await setTokenStorage("")
  await setUsernameStorage("")
  await setIsLoggedInStorage("false")
  dispatch(setLoading(false))
}

export const setEmail = (
  email: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setData({ email }))
  await setEmailStorage(email)
}

export const setLoading = (isLoading: boolean) =>
  ({
    type: USER_SET_LOADING,
    payload: isLoading,
  } as const)

export const setData = (data: Partial<UserState>) =>
  ({
    type: USER_SET_DATA,
    payload: data,
  } as const)

export const setPWAS = (pwas: PWA[] | undefined) =>
  ({
    type: USER_SET_PWAS,
    payload: pwas,
  } as const)

export const replaceApp = (app: PWA) =>
  ({
    type: USER_REPLACE_APP,
    payload: app,
  } as const)

export const addApp = (app: PWA) =>
  ({
    type: USER_ADD_APP,
    payload: app,
  } as const)

export const removeApp = (appId: number) =>
  ({
    type: USER_REMOVE_APP,
    payload: appId,
  } as const)

export const thunkSetHasReadInstall = (
  hasReadInstall: boolean
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  await setHasReadInstallStorage(hasReadInstall ? "true" : "false")
  dispatch(setData({ hasRead: hasReadInstall }))
}
