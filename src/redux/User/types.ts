import {
  PWA,
  Push,
  Profile,
  StoreNotification,
  Job,
  Education,
  DevLog,
} from "../../util/types"

export interface UserState {
  token: string
  id: number
  loading: boolean
  pwas: PWA[]
  profile: Profile | undefined
  username: string
  email: string
  darkMode: boolean
  isLoggedIn: boolean | undefined
  role: string
  push: Push | undefined
  lastNotId: number
  notifications: StoreNotification[]
  notLoading: boolean
  jobs: Job[]
  educations: Education[]
  starredApps: PWA[]
  devLogs: DevLog[]
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
export const USER_SET_NOT_LOADING = "USER_SET_NOT_LOADING"
export const USER_ADD_JOB = "USER_ADD_JOB"
export const USER_ADD_EDUCATION = "USER_ADD_EDUCATION"
export const USER_REMOVE_JOB = "USER_REMOVE_JOB"
export const USER_REMOVE_EDUCATION = "USER_REMOVE_EDUCATION"
export const USER_ADD_STARRED = "USER_ADD_STARRED"
export const USER_REMOVE_STARRED = "USER_REMOVE_STARRED"

export interface setUserAddStarred {
  type: typeof USER_ADD_STARRED
  payload: PWA
}

export interface setUserRemoveStarred {
  type: typeof USER_REMOVE_STARRED
  payload: number
}

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

export interface SetNotLoadingAction {
  type: typeof USER_SET_NOT_LOADING
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

export interface AddJobAction {
  type: typeof USER_ADD_JOB
  payload: Job
}

export interface RemoveJobAction {
  type: typeof USER_REMOVE_JOB
  payload: number
}

export interface AddEducationAction {
  type: typeof USER_ADD_EDUCATION
  payload: Education
}

export interface RemoveEdicationAction {
  type: typeof USER_REMOVE_EDUCATION
  payload: number
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
  | AddJobAction
  | RemoveJobAction
  | AddEducationAction
  | RemoveEdicationAction
  | ReplaceAppAction
  | SetLoadingAction
  | SetUserAction
  | setDarkModeAction
  | CreateProfileAction
  | SetNotIdAction
  | SetNotAction
  | SetNotLoadingAction
  | setUserAddStarred
  | setUserRemoveStarred
