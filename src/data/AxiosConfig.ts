import axios, { AxiosRequestConfig } from "axios"

const base = {
  Accept: "application/json",
}

const baseHeaders = {
  ...base,
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  //   "Content-Type": "application/x-www-form-urlencoded",
}

type RequestType =
  | "json"
  | "arraybuffer"
  | "blob"
  | "document"
  | "text"
  | "stream"
  | undefined

const AxiosCors = (baseURL: string, requestType?: RequestType) =>
  axios.create({
    baseURL,
    requestType,
  } as AxiosRequestConfig)

const FetchCors = (requestUrl: string) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  })

  const config: RequestInit = {
    method: "GET",
    mode: "no-cors",
    headers,
  }

  const request = new Request(requestUrl, config)

  return fetch(request)
}

export { AxiosCors, FetchCors }
