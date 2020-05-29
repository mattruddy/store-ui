import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { vars } from "../../data/env"
import { Plugins } from "@capacitor/core"
import { AxiosCustomRequestConfig, Image } from "../../util/types"
import { UserRole } from "../User/types"
import { setAlert } from "../Alerts/actions"
declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}
const { Storage } = Plugins
const { API_URL } = vars().env
const TOKEN = "token"
const HAS_LOGGED_IN = "hasLoggedIn"
const HAS_READ = "hasRead"
const DARK_MODE = "darkMode"
const USERNAME = "username"
const EMAIL = "email"
const ROLE = "role"

const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN }),
    Storage.get({ key: HAS_READ }),
    Storage.get({ key: DARK_MODE }),
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
    Storage.get({ key: ROLE }),
  ])
  const isLoggedIn = response[0].value === "true"
  const token = response[1].value || undefined
  const hasRead = response[2].value === "true"
  const darkMode = response[3].value === "true"
  const username = response[4].value || undefined
  const email = response[5].value || undefined
  const role = parseInt(response[6].value || "2")
  const data = {
    isLoggedIn,
    token,
    hasRead,
    darkMode,
    username,
    email,
    role,
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
  await Storage.set({ key: USERNAME, value: role })
}

export const UploadScreenshots = async (
  screenshots: File[],
  appId: number,
  token: string
) => {
  try {
    const formData = new FormData()
    screenshots.forEach((shot) => formData.append("screenshots", shot))
    const requestUrl = `secure/pwas/${appId}`
    const response = await (await Axios()).post(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    })
    const { data } = response
    return data as Image[]
  } catch (e) {
    setAlert({
      message: e.response.message,
      apiResponseStatus: e.response.status,
      timeout: 3000,
      show: true,
    })
    console.log(e)
    return []
  }
}

export const DeleteScreenshot = async (imageId: number, token: string) => {
  try {
    const requestUrl = `secure/pwas/${imageId}`
    await (await Axios()).post(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setAlert({
      message: `Image removed.`,
      timeout: 3000,
      show: true,
    })
  } catch (e) {
    setAlert({
      message: e.response.message,
      apiResponseStatus: e.response.status,
      timeout: 3000,
      show: true,
    })
    console.log(e)
  }
}

const base = {
  Accept: "application/json",
}

const baseHeaders = {
  ...base,
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
}

/*
Axios request response : https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
{
  // `data` is the response that was provided by the server
  data: {},
  // `status` is the HTTP status code from the server response
  status: 200,
  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',
  // `headers` the headers that the server responded with
  // All header names are lower cased
  headers: {},
  // `config` is the config that was provided to `axios` for the request
  config: {},
  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance the browser
  request: {}
}
*/

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
          Authorization: `Token ${token}`,
          ...baseHeaders,
        }
      : baseHeaders,
  } as AxiosCustomRequestConfig)
}

export {
  Axios,
  getUserData,
  setHasReadInstallStorage,
  setDarkModeStorage,
  setIsLoggedInStorage,
  setTokenStorage,
  setEmailStorage,
  setUsernameStorage,
  setRoleStorage,
}
