import {
  setTokenData,
  setIsLoggedInData,
  getUserData,
  setHasReadInstallData,
  getProfile,
} from "../dataApi"
import { ActionType, PWA, UserProfile } from "../../util/types"
import { UserState } from "./user.state"

export const loadUserData = () => async (dispatch: React.Dispatch<any>) => {
  dispatch(setLoading(true))
  const data = await getUserData()
  dispatch(setData(data))
  dispatch(setLoading(false))
}

export const setToken = (token?: string) => async (
  dispatch: React.Dispatch<any>
) => {
  await setTokenData(token)
  return {
    type: "set-token",
    token,
  } as const
}

export const setHasReadInstall = (hasReadInstall?: string) => async (
  dispatch: React.Dispatch<any>
) => {
  await setHasReadInstallData(hasReadInstall)
  return {
    type: "set-has-read",
    hasReadInstall,
  } as const
}

export const setIsLoggedIn = (loggedIn: boolean) => async (
  dispatch: React.Dispatch<any>
) => {
  await setIsLoggedInData(loggedIn)
  return {
    type: "set-is-loggedin",
    loggedIn,
  } as const
}

export const loadProfile = () => async (dispatch: React.Dispatch<any>) => {
  const profile = (await getProfile()) as UserProfile
  if (profile) {
    dispatch(setProfile(profile.pwas))
    dispatch(setUsername(profile.username))
    dispatch(setEmail(profile.email))
  }
}

export const setLoading = (isLoading: boolean) =>
  ({
    type: "set-user-loading",
    isLoading,
  } as const)

export const setData = (data: Partial<UserState>) =>
  ({
    type: "set-user-data",
    data,
  } as const)

export const setProfile = (pwas: PWA[] | undefined) =>
  ({
    type: "set-profile",
    pwas,
  } as const)

export const setUsername = (username: string | undefined) =>
  ({
    type: "set-username",
    username,
  } as const)

export const setEmail = (email: string | undefined) => ({
  type: "set-email",
  email
} as const)

export const replaceApp = (app: PWA) =>
  ({
    type: "replace-app",
    app,
  } as const)

export const addApp = (app: PWA) =>
  ({
    type: "add-app",
    app,
  } as const)

export const removeApp = (appId: number) =>
  ({
    type: "remove-app",
    appId,
  } as const)

export type UserActions =
  | ActionType<typeof setLoading>
  | ActionType<typeof setData>
  | ActionType<typeof setToken>
  | ActionType<typeof setIsLoggedIn>
  | ActionType<typeof setHasReadInstall>
  | ActionType<typeof replaceApp>
  | ActionType<typeof setProfile>
  | ActionType<typeof setUsername>
  | ActionType<typeof setEmail>
  | ActionType<typeof addApp>
  | ActionType<typeof removeApp>
