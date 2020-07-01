import {
  UserState,
  UserActionTypes,
  USER_SET_LOADING,
  USER_SET_DATA,
  USER_SET_PWAS,
  USER_REPLACE_APP,
  USER_ADD_APP,
  USER_REMOVE_APP,
  USER_SET_DARKMODE,
  USER_CREATE_PROFILE,
  USER_SET_NOT_ID,
  USER_SET_NOT,
  USER_SET_NOT_LOADING,
  USER_ADD_JOB,
  USER_ADD_EDUCATION,
  USER_REMOVE_JOB,
  USER_REMOVE_EDUCATION,
  USER_ADD_STARRED,
  USER_REMOVE_STARRED,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"

const DEFAULT_STATE_USER: UserState = {
  token: "",
  id: -1,
  loading: false,
  pwas: [],
  profile: undefined,
  username: "",
  email: "",
  darkMode: false,
  isLoggedIn: undefined,
  role: "DEVELOPER",
  push: undefined,
  lastNotId: -1,
  notifications: [],
  notLoading: false,
  jobs: [],
  educations: [],
  starredApps: [],
}

const userReducer = (
  state = DEFAULT_STATE_USER,
  action: UserActionTypes | AppActionTypes
): UserState => {
  switch (action.type) {
    case USER_SET_DARKMODE:
      return {
        ...state,
        darkMode: action.payload,
      }

    case USER_SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case USER_SET_NOT_LOADING:
      return {
        ...state,
        notLoading: action.payload,
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

    case USER_ADD_STARRED:
      return {
        ...state,
        starredApps: [action.payload, ...state.starredApps],
      }

    case USER_REMOVE_STARRED:
      return {
        ...state,
        starredApps: state.starredApps.filter(
          (x) => x.appId !== action.payload
        ),
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

    case USER_ADD_JOB:
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
      }

    case USER_REMOVE_JOB:
      return {
        ...state,
        jobs: [...state.jobs.filter((x) => x.id !== action.payload)],
      }

    case USER_ADD_EDUCATION:
      return {
        ...state,
        educations: [action.payload, ...state.educations],
      }

    case USER_REMOVE_EDUCATION:
      return {
        ...state,
        educations: [
          ...state.educations.filter((x) => x.id !== action.payload),
        ],
      }
    case USER_CREATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
      }

    case REDUX_RESET:
      return DEFAULT_STATE_USER

    case USER_SET_NOT_ID:
      return {
        ...state,
        lastNotId: action.payload,
      }

    case USER_SET_NOT:
      return {
        ...state,
        notifications: action.payload,
      }

    default:
      return state
  }
}

export { DEFAULT_STATE_USER, userReducer }
