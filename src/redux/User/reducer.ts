import {
  UserState,
  UserActionTypes,
  USER_SET_LOADING,
  USER_SET_DATA,
  USER_SET_PWAS,
  USER_REPLACE_APP,
  USER_ADD_APP,
  USER_REMOVE_APP,
  USER_HAS_READ_INSTALL,
  UserRole,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"

const DEFAULT_STATE_USER: UserState = {
  token: "",
  id: -1,
  loading: false,
  hasRead: false,
  pwas: [],
  username: "",
  email: "",
  darkMode: false,
  isLoggedIn: false,
  role: UserRole.Dev,
}

const userReducer = (
  state = DEFAULT_STATE_USER,
  action: UserActionTypes | AppActionTypes
): UserState => {
  switch (action.type) {
    case USER_SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case USER_SET_DATA:
      return {
        ...state,
        ...action.payload,
      }

    case USER_SET_PWAS:
      return {
        ...state,
        pwas: action.payload,
      }

    case USER_REPLACE_APP:
      return {
        ...state,
        pwas: [
          action.payload,
          ...state.pwas.filter((x) => x.appId !== action.payload.appId),
        ],
      }

    case USER_ADD_APP:
      return {
        ...state,
        pwas: [...state.pwas, action.payload],
      }

    case USER_REMOVE_APP:
      return {
        ...state,
        pwas: [...state.pwas.filter((x) => x.appId !== action.payload)],
      }

    case USER_HAS_READ_INSTALL:
      return {
        ...state,
        hasRead: action.payload,
      }

    case REDUX_RESET:
      return DEFAULT_STATE_USER

    default:
      return state
  }
}

export { DEFAULT_STATE_USER, userReducer }
