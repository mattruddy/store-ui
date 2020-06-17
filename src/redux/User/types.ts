import { PWA, Push } from "../../util/types"

export interface UserState {
  token: string
  id: number
  loading: boolean
  pwas: PWA[]
  username: string
  email: string
  darkMode: boolean
  isLoggedIn: boolean
  role: UserRole
  push: Push | undefined
}

export enum UserRole {
  User = 0,
  Dev = 1,
  Mod = 2,
  Admin = 3,
}

export const USER_SET_LOADING = "USER_SET_LOADING"
export const USER_SET = "USER_SET"
export const USER_SET_DATA = "USER_SET_DATA"
export const USER_SET_PWAS = "USER_SET_PWAS"
export const USER_REPLACE_APP = "USER_REPLACE_APP"
export const USER_ADD_APP = "USER_ADD_APP"
export const USER_REMOVE_APP = "USER_REMOVE_APP"
export const USER_HAS_READ_INSTALL = "USER_HAS_READ_INSTALL"
export const USER_SET_DARKMODE = "USER_SET_DARKMODE"

export interface setDarkMode {
  type: typeof USER_SET_DARKMODE
  payload: boolean
}

export interface setDarkMode {
  type: typeof USER_SET_DARKMODE
  payload: boolean
}
export interface SetUserAction {
  type: typeof USER_SET
  payload: string
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
  | SetLoadingAction
  | SetDataAction
  | SetPWAsAction
  | RemoveAppAction
  | AddAppAction
  | ReplaceAppAction
  | SetLoadingAction
  | SetUserAction
  | setDarkMode
