import { UserActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"
import { Reducer } from "redux"

export interface UserState {
  token?: string
  id?: number
}

const DEFAULT_STATE_USER: UserState = {
  token: undefined,
  id: undefined,
}

const User: Reducer<UserState> = (
  state = DEFAULT_STATE_USER,
  action
): UserState => {
  const { type, payload } = action
  switch (type) {
    case UserActionTypes.USER_SET:
      return {
        ...state,
        ...payload,
        updating: false,
        updated: true,
        error: null,
      }

    case AppActionTypes.REDUX_RESET:
      return DEFAULT_STATE_USER

    default:
      return state
  }
}

export { DEFAULT_STATE_USER, User }
