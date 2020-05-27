import { SET_WINDOW } from "../Window/types"

export interface AppState {
  version: string
  localStorageUsage: string
  localStorageQuota: string
  localStorageUsageDetails: string
}

export const APP_SET_VERSION = "APP_SET_VERSION"
export const REDUX_RESET = "REDUX_RESET"

export interface SetWindowAction {
  type: typeof SET_WINDOW
  payload: any
}

export interface ResetReduxAction {
  type: typeof REDUX_RESET
}

export interface SetAppVersion {
  type: typeof APP_SET_VERSION
  payload: any
}

export type AppActionTypes = SetWindowAction | ResetReduxAction | SetAppVersion
