import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { vars } from "../../data/env"
import { Plugins } from "@capacitor/core"
import { AxiosCustomRequestConfig, Image, Push } from "../../util/types"
import { UserRole } from "../User/types"
import { setAlert } from "../Alerts/actions"

const { Storage } = Plugins
const { API_URL } = vars().env
const TOKEN = "token"
const HAS_LOGGED_IN = "hasLoggedIn"
const HAS_READ = "hasRead"
const DARK_MODE = "darkMode"
const USERNAME = "username"
const EMAIL = "email"
const ROLE = "role"
const PUSH_KEY = "push_key"
const PUSH_AUTH = "push_auth"
const PUSH_ENDPOINT = "push_endpoint"

const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN }),
    Storage.get({ key: HAS_READ }),
    Storage.get({ key: DARK_MODE }),
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
    Storage.get({ key: ROLE }),
    Storage.get({ key: PUSH_KEY }),
    Storage.get({ key: PUSH_AUTH }),
    Storage.get({ key: PUSH_ENDPOINT }),
  ])
  const isLoggedIn = response[0].value === "true"
  const token = response[1].value || undefined
  const hasRead = response[2].value === "true"
  const darkMode = response[3].value === "true"
  const username = response[4].value || undefined
  const email = response[5].value || undefined
  const role = parseInt(response[6].value || "2")
  const pushKey = response[7].value || undefined
  const pushAuth = response[8].value || undefined
  const pushEndpoint = response[9].value || undefined
  const data = {
    isLoggedIn,
    token,
    hasRead,
    darkMode,
    username,
    email,
    role,
    push: pushKey
      ? ({ key: pushKey, auth: pushAuth, endpoint: pushEndpoint } as Push)
      : undefined,
  }
  return data
}

const setHasReadInstallStorage = async (hasRead: "false" | "true") => {
  await Storage.set({ key: HAS_READ, value: hasRead })
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
    console.log(e)
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
    return console.log(e)
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
  const { isLoggedIn, token, hasRead } = response

  return axios.create({
    baseURL: API_URL,
    // timeout: 25000,
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
  const { isLoggedIn, token, hasRead } = response

  return axios.create({
    withCredentials: true,
    baseURL: API_URL,
    // timeout: 25000,
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
  setHasReadInstallStorage,
  setDarkModeStorage,
  setIsLoggedInStorage,
  setTokenStorage,
  setEmailStorage,
  setUsernameStorage,
  setRoleStorage,
  setPushStorage,
}
