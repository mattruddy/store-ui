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
  USER_ADD_LOG,
  USER_REMOVE_LOG,
  USER_ADD_LIKE_LOG,
  USER_REMOVE_LIKE_LOG,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"
import { AppRatings, PWA, DevLog } from "../../util/types"

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
  devLogs: [],
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
      const nPwa = {
        ...action.payload.app,
        appRatings: {
          hasRated: true,
          ratings: [
            action.payload.rating.rating,
            ...action.payload.app.appRatings.ratings,
          ],
        } as AppRatings,
      } as PWA
      const nStarApps = action.payload.isMyApp
        ? [...state.starredApps]
        : [nPwa, ...state.starredApps]
      const nPwas = action.payload.isMyApp
        ? [
            nPwa,
            ...state.pwas.filter((x) => x.appId !== action.payload.app.appId),
          ]
        : [...state.pwas]
      return {
        ...state,
        starredApps: nStarApps,
        pwas: nPwas,
      }

    case USER_REMOVE_STARRED:
      return {
        ...state,
        starredApps: state.starredApps.filter(
          (x) => x.appId !== action.payload.appId
        ),
      }

    case USER_ADD_LIKE_LOG:
      const devLogLike = state.devLogs.find(
        (x) => x.logId === action.payload.logId
      )
      if (!devLogLike) {
        return state
      }
      const nDevLogLike = {
        ...devLogLike,
        appLikes: {
          hasRated: true,
          ratings: [
            action.payload.like.rating,
            ...devLogLike!.appLikes.ratings,
          ],
        },
      } as DevLog
      return {
        ...state,
        devLogs: state.devLogs
          .filter((x) => x.logId !== action.payload.logId)
          .concat(nDevLogLike)
          .sort(
            (a, b) =>
              new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
          ),
      }

    case USER_REMOVE_LIKE_LOG:
      const devLogNotLike = state.devLogs.find(
        (x) => x.logId === action.payload.logId
      )
      if (!devLogNotLike) {
        return state
      }
      const nDevLogNotLike = {
        ...devLogNotLike,
        appLikes: {
          hasRated: false,
          ratings: devLogNotLike!.appLikes.ratings.filter(
            (x) =>
              x.from.toLowerCase() !== action.payload.username.toLowerCase()
          ),
        },
      } as DevLog
      return {
        ...state,
        devLogs: state.devLogs
          .filter((x) => x.logId !== action.payload.logId)
          .concat(nDevLogNotLike)
          .sort(
            (a, b) =>
              new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
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

    case USER_ADD_LOG:
      return {
        ...state,
        devLogs: [action.payload, ...state.devLogs],
      }

    case USER_REMOVE_LOG:
      return {
        ...state,
        devLogs: [...state.devLogs.filter((x) => x.logId !== action.payload)],
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
