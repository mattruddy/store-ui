import {
  UserState,
  USER_SET_LOADING,
  USER_SET_DATA,
  USER_SET_PWAS,
  USER_REPLACE_APP,
  USER_ADD_APP,
  USER_REMOVE_APP,
  UserRole,
  USER_CREATE_PROFILE,
  USER_SET_NOT_ID,
  USER_SET_NOT,
  USER_SET_NOT_LOADING,
} from "./types"
import { PWA, Push, Profile, StoreNotification } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import {
  getUserData,
  setEmailStorage,
  setTokenStorage,
  setUsernameStorage,
  setIsLoggedInStorage,
  Axios,
  AxiosForm,
  setRoleStorage,
  UploadScreenshots,
  DeleteScreenshot,
  setPushStorage,
  setDarkModeStorage,
  setLastNotIdStorage,
} from "../Actions"
import { setAlert } from "../Alerts/actions"
import { notifications } from "ionicons/icons"

export const thunkAddPush = (
  push: Push
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setData({ push: push }))
  await setPushStorage(push)
}

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

export const thunkSignUp = (
  username: string,
  password: string,
  email: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const url = `public/signup`
    const response = await (await Axios()).post(url, {
      username,
      password,
      email,
    })
    const {
      data: { token },
    } = response

    dispatch(setData({ token, username, isLoggedIn: true }))
    await setTokenStorage(token)
    await setUsernameStorage(username)
    await setEmailStorage(email)
    await setIsLoggedInStorage("true")
    dispatch(
      setAlert({
        message: "Signed Up!",
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
    return console.error(e)
  } finally {
    dispatch(setLoading(false))
  }
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
    dispatch(setData({ token, username, isLoggedIn: true }))
    await setTokenStorage(token)
    await setUsernameStorage(username)
    await setIsLoggedInStorage("true")
    dispatch(
      setAlert({
        message: "Logged In",
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
  } catch (e) {
    console.error(e.response)
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
    return console.error(e)
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkCreateProfile = (
  gitHub: string,
  linkedIn: string,
  twitter: string,
  showEmail: boolean,
  email: string,
  about: string,
  header: string | undefined,
  location: string | undefined,
  fullName: string | undefined,
  avatar?: File
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const url = "secure/profile"
    const data = {
      gitHub,
      linkedIn,
      twitter,
      showEmail,
      about,
      email,
      header,
      location,
      fullName,
    }
    const fd = new FormData()
    fd.append("info", JSON.stringify(data))
    avatar && fd.append("avatar", avatar)
    const resp = await (await AxiosForm(fd)).post(url, fd)
    dispatch(setProfile(resp.data as Profile))
    dispatch(setData({ email }))
    dispatch(
      setAlert({
        message: "Profile Updated",
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
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

export const thunkLoadProfile = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action
> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const url = `secure/profile`
    const resp = await (await Axios()).get(url)
    const {
      data: { username, pageResponses, email, profile },
    } = resp
    dispatch(
      setData({
        email,
        username,
        pwas: pageResponses as PWA[],
        profile: profile as Profile,
      })
    )
    await setEmailStorage(email)
    await setUsernameStorage(username)
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
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
      profile: undefined,
      token: "",
      email: "",
      username: "",
      isLoggedIn: false,
      pwas: [],
      id: -1,
    })
  )
  await setEmailStorage("")
  await setTokenStorage("")
  await setUsernameStorage("")
  await setRoleStorage("")
  await setIsLoggedInStorage("false")
  dispatch(setLoading(false))
}

export const thunkSetEmail = (
  email: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setData({ email }))
  await setEmailStorage(email)
}

export const thunkSetDarkMode = (
  darkMode: boolean
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setData({ darkMode }))
  await setDarkModeStorage(darkMode ? "true" : "false")
}

export const setLoading = (isLoading: boolean) =>
  ({
    type: USER_SET_LOADING,
    payload: isLoading,
  } as const)

export const setNotLoading = (isLoading: boolean) =>
  ({
    type: USER_SET_NOT_LOADING,
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

export const setProfile = (profile: Profile | undefined) =>
  ({
    type: USER_CREATE_PROFILE,
    payload: profile,
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

export const setLastNotId = (id: number) =>
  ({
    type: USER_SET_NOT_ID,
    payload: id,
  } as const)

export const setNotifications = (notifications: StoreNotification[]) => ({
  type: USER_SET_NOT,
  payload: notifications,
})

export const thunkThirdPartyLogin = (
  token: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    await setTokenStorage(token)
    dispatch(setData({ token, isLoggedIn: true }))
    await setRoleStorage(UserRole.Dev.toString())
    await setIsLoggedInStorage("true")
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkAddPWA = (
  name: string,
  description: string,
  url: string,
  category: string,
  icon: File,
  screenshots: File[],
  tags: string[]
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const info = {
      name: name,
      description: description,
      link: url,
      category: category,
      tags: tags,
    }

    const fd = new FormData()
    fd.append("icon", icon)
    screenshots.forEach((screenshot) => fd.append("screenshots", screenshot))
    fd.append("info", JSON.stringify(info))

    const requestUrl = `secure/pwas`
    const response = await (await AxiosForm(fd)).post(requestUrl, fd)
    const { data } = response
    dispatch(addApp(data as PWA))
    dispatch(
      setAlert({
        message: `${name} was submitted`,
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
    //return data
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkDeletePWA = (
  pwa: PWA
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const requestUrl = `secure/pwas/${pwa.appId}`
    const response = await (await Axios()).delete(requestUrl)
    dispatch(removeApp(pwa.appId))
    dispatch(
      setAlert({
        message: `${pwa.name} was removed`,
        apiResponseStatus: response.status,
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
    return console.error(e)
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkUpdateApp = (
  name: string,
  description: string,
  category: string,
  appId: number,
  tags: string[],
  newScreenshots: File[],
  deletedScreenshotIds: number[]
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    if (newScreenshots.length > 0)
      await UploadScreenshots(newScreenshots, appId)
    await Promise.all(
      deletedScreenshotIds.map(async (x) => await DeleteScreenshot(x))
    )
    const requestUrl = `secure/pwas/${appId}`
    const response = await (await Axios()).put(requestUrl, {
      name,
      description: description,
      category: category,
      tags: tags,
    })
    const { data } = response
    dispatch(replaceApp(data as PWA))
    dispatch(
      setAlert({
        message: `${name} was updated`,
        apiResponseStatus: response.status,
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
    return data
  } catch (e) {
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
    return console.error(e)
  } finally {
    dispatch(setLoading(false))
  }
}

export const thunkSetLastNotId = (
  id: number
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
  dispatch(setLastNotId(id))
  await setLastNotIdStorage(id.toString())
}

export const thunkLoadNotifications = (): ThunkAction<
  void,
  ReduxCombinedState,
  null,
  Action
> => async (dispatch) => {
  dispatch(setNotLoading(true))
  try {
    const url = `/public/notifys`
    const resp = await (await Axios()).get(url)
    const data = resp.data as StoreNotification[]
    dispatch(setNotifications(data))
    return data
  } catch (e) {
    console.log(e)
    return undefined
  } finally {
    dispatch(setNotLoading(false))
  }
}
