import { UserState, USER_SET, UserActionTypes } from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"

const DEFAULT_STATE_USER: UserState = {
  token: undefined,
  id: undefined,
}

const userReducer = (
  state = DEFAULT_STATE_USER,
  action: UserActionTypes | AppActionTypes
): UserState => {
  switch (action.type) {
    case USER_SET:
      return {
        ...state,
        ...action.payload,
        updating: false,
        updated: true,
        error: null,
      }

    case REDUX_RESET:
      return DEFAULT_STATE_USER

    default:
      return state
  }
}

export { DEFAULT_STATE_USER, userReducer }
