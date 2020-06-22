import axios, { AxiosInstance } from "axios"
import { vars } from "../../data/env"
import { Plugins } from "@capacitor/core"
import { AxiosCustomRequestConfig, Image, Push } from "../../util/types"
import { setAlert } from "../Alerts/actions"
import { async } from "q"

const { Storage } = Plugins
const { API_URL } = vars().env
const TOKEN = "token"
const HAS_LOGGED_IN = "hasLoggedIn"
const DARK_MODE = "darkMode"
const USERNAME = "username"
const EMAIL = "email"
const ROLE = "role"
const PUSH_KEY = "push_key"
const PUSH_AUTH = "push_auth"
const PUSH_ENDPOINT = "push_endpoint"
const LAST_NOT_ID = "LAST_NOT_ID"

const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN }),
    Storage.get({ key: DARK_MODE }),
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
    Storage.get({ key: ROLE }),
    Storage.get({ key: PUSH_KEY }),
    Storage.get({ key: PUSH_AUTH }),
    Storage.get({ key: PUSH_ENDPOINT }),
    Storage.get({ key: LAST_NOT_ID }),
  ])
  const isLoggedIn = response[0].value === "true"
  const token = response[1].value || undefined
  const darkMode = response[2].value === "true"
  const username = response[3].value || undefined
  const email = response[4].value || undefined
  const role = parseInt(response[5].value || "2")
  const pushKey = response[6].value || undefined
  const pushAuth = response[7].value || undefined
  const pushEndpoint = response[8].value || undefined
  const lastNotId = parseInt(response[9].value || "-1")
  const data = {
    isLoggedIn,
    token,
    darkMode,
    username,
    email,
    role,
    push: pushKey
      ? ({ key: pushKey, auth: pushAuth, endpoint: pushEndpoint } as Push)
      : undefined,
    lastNotId,
  }
  return data
}

const setTokenStorage = async (token: string) => {
  await Storage.set({ key: TOKEN, value: token })
}

const setDarkModeStorage = async (darkMode: "true" | "false") => {
  await Storage.set({ key: DARK_MODE, value: darkMode })
}

const setIsLoggedInStorage = async (isLoggedIn: "true" | "false") => {
  await Storage.set({ key: HAS_LOGGED_IN, value: isLoggedIn })
}

const setUsernameStorage = async (username: string) => {
  await Storage.set({ key: USERNAME, value: username })
}

const setEmailStorage = async (email: string) => {
  await Storage.set({ key: USERNAME, value: email })
}

const setRoleStorage = async (role: string) => {
  await Storage.set({ key: ROLE, value: role })
}

const setPushStorage = async (push: Push) => {
  await Storage.set({ key: PUSH_AUTH, value: push.auth })
  await Storage.set({ key: PUSH_KEY, value: push.key })
  await Storage.set({ key: PUSH_ENDPOINT, value: push.endpoint })
}

const setLastNotIdStorage = async (id: string) => {
  await Storage.set({ key: LAST_NOT_ID, value: id })
}

export const UploadScreenshots = async (screenshots: File[], appId: number) => {
  try {
    const formData = new FormData()
    screenshots.forEach((shot) => formData.append("screenshots", shot))
    const requestUrl = `secure/screenshot/${appId}`
    const response = await (await AxiosForm(formData)).post(
      requestUrl,
      formData
    )
    const { data } = response
    return data as Image[]
  } catch (e) {
    setAlert({
      message: e.response.data.message,
      apiResponseStatus: e.response.status,
      timeout: 3000,
      show: true,
    })
    console.error(e)
    return []
  }
}

export const DeleteScreenshot = async (imageId: number) => {
  try {
    const requestUrl = `secure/screenshot/${imageId}`
    const response = await (await Axios()).delete(requestUrl)
    setAlert({
      message: `Image removed.`,
      timeout: 3000,
      show: true,
    })
    return response
  } catch (e) {
    setAlert({
      message: e.response.data.message,
      apiResponseStatus: e.response.status,
      timeout: 3000,
      show: true,
    })
    return console.error(e)
  }
}

const base = {
  Accept: "application/json",
}

const baseFormHeaders = (payload: FormData) => ({
  ...base,
  "Accept-Language": "en-US,en;q=0.8",
  // @ts-ignore
  "Content-Type": `multipart/form-data; boundary=${payload._boundary}`,
})

const baseHeaders = {
  ...base,
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
}

const AxiosForm = async (payload: FormData): Promise<AxiosInstance> => {
  const response = await getUserData()
  const { token } = response

  return axios.create({
    baseURL: API_URL,
    responseType: "json",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...baseFormHeaders(payload),
        }
      : baseFormHeaders(payload),
  })
}

const Axios = async (responseType: "json" = "json"): Promise<AxiosInstance> => {
  const response = await getUserData()
  const { token } = response

  return axios.create({
    withCredentials: true,
    baseURL: API_URL,
    crossDomain: true,
    responseType,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  } as AxiosCustomRequestConfig)
}

export {
  AxiosForm,
  Axios,
  getUserData,
  setDarkModeStorage,
  setIsLoggedInStorage,
  setTokenStorage,
  setEmailStorage,
  setUsernameStorage,
  setRoleStorage,
  setPushStorage,
  setLastNotIdStorage,
}
