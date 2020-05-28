import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { vars } from "../../data/env"
import { Plugins } from "@capacitor/core"
import { AxiosCustomRequestConfig } from "../../util/types"
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

const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN }),
    Storage.get({ key: HAS_READ }),
    Storage.get({ key: DARK_MODE }),
    Storage.get({ key: USERNAME }),
    Storage.get({ key: EMAIL }),
  ])
  const isLoggedIn = response[0].value === "true"
  const token = response[1].value || undefined
  const hasRead = response[2].value === "true"
  const darkMode = response[3].value === "true"
  const username = response[4].value || undefined
  const email = response[5].value || undefined
  const data = {
    isLoggedIn,
    token,
    hasRead,
    darkMode,
    username,
    email,
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
}
