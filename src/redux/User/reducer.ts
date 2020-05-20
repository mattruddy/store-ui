import { UserActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"

const DEFAULT_STATE_USER = {
  token: null,
  id: null,
}

const User = (state = DEFAULT_STATE_USER, action: ActionProps) => {
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
