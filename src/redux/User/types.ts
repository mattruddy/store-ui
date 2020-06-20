import { PWA, Push, Profile, StoreNotification } from "../../util/types"

export interface UserState {
  token: string
  id: number
  loading: boolean
  pwas: PWA[]
  profile: Profile | undefined
  username: string
  email: string
  darkMode: boolean
  isLoggedIn: boolean
  role: UserRole
  push: Push | undefined
  lastNotId: number
  notifications: StoreNotification[]
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
export const USER_CREATE_PROFILE = "USER_CREATE_PROFILE"
export const USER_SET_NOT_ID = "USER_SET_NOT_ID"
export const USER_SET_NOT = "USER_SET_NOT"

export interface setDarkMode {
  type: typeof USER_SET_DARKMODE
  payload: boolean
}

export interface setDarkModeAction {
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

export interface CreateProfileAction {
  type: typeof USER_CREATE_PROFILE
  payload: Profile
}

export interface AddAppAction {
  type: typeof USER_ADD_APP
  payload: PWA
}

export interface RemoveAppAction {
  type: typeof USER_REMOVE_APP
  payload: number
}

export interface SetNotIdAction {
  type: typeof USER_SET_NOT_ID
  payload: number
}

export interface SetNotAction {
  type: typeof USER_SET_NOT
  payload: StoreNotification[]
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
  | setDarkModeAction
  | CreateProfileAction
  | SetNotIdAction
  | SetNotAction
