import {
  UserState,
  USER_SET_LOADING,
  USER_SET_DATA,
  USER_SET_PWAS,
  USER_SET_USERNAME,
  USER_SET_EMAIL,
  USER_REPLACE_APP,
  USER_ADD_APP,
  USER_REMOVE_APP,
} from "./types"
import { PWA } from "../../util/types"

export const setLoading = (isLoading: boolean) =>
  ({
    type: USER_SET_LOADING,
    isLoading,
  } as const)

export const setData = (data: Partial<UserState>) =>
  ({
    type: USER_SET_DATA,
    data,
  } as const)

export const setPWAS = (pwas: PWA[] | undefined) =>
  ({
    type: USER_SET_PWAS,
    pwas,
  } as const)

export const setUsername = (username: string | undefined) =>
  ({
    type: USER_SET_USERNAME,
    username,
  } as const)

export const setEmail = (email: string | undefined) =>
  ({
    type: USER_SET_EMAIL,
    email,
  } as const)

export const replaceApp = (app: PWA) =>
  ({
    type: USER_REPLACE_APP,
    app,
  } as const)

export const addApp = (app: PWA) =>
  ({
    type: USER_ADD_APP,
    app,
  } as const)

export const removeApp = (appId: number) =>
  ({
    type: USER_REMOVE_APP,
    appId,
  } as const)
