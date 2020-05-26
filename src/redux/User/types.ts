export interface UserState {
  token?: string
  id?: number
}

export const USER_SET = "USER_SET"
export const USER_SET_SETTINGS = "USER_SET_SETTINGS"
export const USER_SET_LOCATION = "USER_SET_LOCATION"
export const USER_RESET_LOCATION = "USER_RESET_LOCATION"

export interface SetUserAction {
  type: typeof USER_SET
  payload: any
}

export type UserActionTypes = SetUserAction
