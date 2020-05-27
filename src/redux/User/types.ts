import { PWA } from "../../util/types"

export interface UserState {
  token: string
  id: number
  loading: boolean
  hasRead: false
  pwas: PWA[]
  username: string
  email: string
}

export const USER_SET = "USER_SET"
export const USER_SET_LOADING = "USER_SET_LOADING"
export const USER_SET_USERNAME = "USER_SET_USERNAME"
export const USER_SET_DATA = "USER_SET_DATA"
export const USER_SET_PWAS = "USER_SET_PWAS"
export const USER_SET_EMAIL = "USER_SET_EMAIL"
export const USER_REPLACE_APP = "USER_REPLACE_APP"
export const USER_ADD_APP = "USER_ADD_APP"
export const USER_REMOVE_APP = "USER_REMOVE_APP"

export interface SetUserAction {
  type: typeof USER_SET
  payload: any
}

export interface SetLoadingAction {
  type: typeof USER_SET_LOADING
  payload: boolean
}

export interface SetDataAction {
  type: typeof USER_SET_DATA
  payload: Partial<UserState>
}

export interface SetPWAsAction {
  type: typeof USER_SET_PWAS
  payload: PWA[]
}

export interface SetUsernameAction {
  type: typeof USER_SET_USERNAME
  payload: string
}

export interface SetEmailAction {
  type: typeof USER_SET_EMAIL
  payload: string
}

export interface ReplaceAppAction {
  type: typeof USER_REPLACE_APP
  payload: PWA
}

export interface AddAppAction {
  type: typeof USER_ADD_APP
  payload: PWA
}

export interface RemoveAppAction {
  type: typeof USER_REMOVE_APP
  payload: number
}

export type UserActionTypes =
  | SetUserAction
  | SetLoadingAction
  | SetDataAction
  | SetEmailAction
  | SetPWAsAction
  | RemoveAppAction
  | AddAppAction
  | ReplaceAppAction
  | SetUsernameAction
  | SetLoadingAction
