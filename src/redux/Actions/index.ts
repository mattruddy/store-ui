import axios, { AxiosRequestConfig } from "axios"
import { vars } from "../../data/env"
import { Plugins } from "@capacitor/core"
import { AxCustom, AxiosCustomRequestConfig } from "../../util/types"
declare module "axios" {
  export interface AxiosResponse<T = any> extends Promise<T> {}
}
const { Storage } = Plugins
const { API_URL } = vars().env
const TOKEN = "token"
const HAS_LOGGED_IN = "hasLoggedIn"
const HAS_READ = "hasRead"

const getUserData = async () => {
  const response = await Promise.all([
    Storage.get({ key: HAS_LOGGED_IN }),
    Storage.get({ key: TOKEN }),
    Storage.get({ key: HAS_READ }),
  ])
  const isLoggedIn = response[0].value === "true"
  const token = response[1].value || undefined
  let hasRead = response[2].value || undefined
  if (hasRead === undefined) {
    // this is the toast that gets displayed to checkout
    // install instructions
    await setHasReadInstallData("false")
    hasRead = "false"
  }
  const data = {
    isLoggedIn,
    token,
    hasRead,
  }
  return data
}

const setHasReadInstallData = async (hasRead?: string) => {
  if (hasRead === undefined) {
    await Storage.set({ key: HAS_READ, value: "false" })
  } else {
    await Storage.set({ key: HAS_READ, value: hasRead })
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

const Axios = async (url: string, method?: "GET", responseType?: "json") => {
  const response = await getUserData()
  const { isLoggedIn, token, hasRead } = response

  return await axios.request({
    withCredentials: true,
    baseURL: API_URL,
    url,
    method,
    //timeout: 25000,
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

export { Axios }
