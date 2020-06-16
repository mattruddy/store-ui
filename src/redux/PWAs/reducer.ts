import {
  PWAsActionTypes,
  PWAS_PENDING,
  PWAS_COMPLETE,
  PWAsState,
  HOME_SET,
  PWASection,
  PWAS_SECTION_ADD,
  PWAS_SECTION_REPLACE,
  PWAS_ADD,
  RATINGS_COMPLETE,
  RATINGS_PENDING,
  RATINGS_ADD,
  PWAS_DATA,
  RATING_ADD,
  DEV_ADD,
  DEV_PENDING,
  DEV_COMPLETE,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"
import { HomePWAs, PWA } from "../../util/types"

const DEFAULT_STATE_PWAS: PWAsState = {
  count: 0,
  next: "",
  previous: "",
  pwaSections: [] as PWASection[],
  isPending: false,
  pwas: [],
  error: "",
  search: "",
  home: { topApps: [], newApps: [], discoverApps: [] } as HomePWAs,
  isRatingsPending: false,
  isDevPending: false,
  devs: [],
}

const pwasReducer = (
  state = DEFAULT_STATE_PWAS as PWAsState,
  action: PWAsActionTypes | AppActionTypes
): PWAsState => {
  switch (action.type) {
    case PWAS_DATA:
      return { ...state, ...action.payload }
    case PWAS_PENDING:
      return { ...state, isPending: true }
    case PWAS_COMPLETE:
      return { ...state, isPending: false }
    case DEV_PENDING:
      return { ...state, isDevPending: true }
    case DEV_COMPLETE:
      return { ...state, isDevPending: false }
    case RATINGS_PENDING:
      return { ...state, isRatingsPending: true }
    case RATINGS_ADD:
      const oldPwa = state.pwas.find((x) => x.appId === action.payload.appId)
      if (!oldPwa) return state
      const newPwa = {
        ...oldPwa,
        ratings: [...oldPwa.ratings, ...action.payload.ratings],
      } as PWA
      return {
        ...state,
        pwas: [
          ...state.pwas.filter((x) => x.appId !== action.payload.appId),
          newPwa,
        ],
      }
    case RATING_ADD:
      const oPwa = state.pwas.find((x) => x.appId === action.payload.appId)
      if (!oPwa) return state
      const nPwa = {
        ...oPwa,
        ratings: [...oPwa.ratings, action.payload.newRating.rating],
        averageRating: action.payload.newRating.averageStar,
        ratingsCount: action.payload.newRating.ratingCount,
      } as PWA
      return {
        ...state,
        pwas: [
          ...state.pwas.filter((x) => x.appId !== action.payload.appId),
          nPwa,
        ],
      }
    case RATINGS_COMPLETE:
      return { ...state, isRatingsPending: false }

    case PWAS_SECTION_ADD:
      return { ...state, pwaSections: [...state.pwaSections, action.payload] }

    case PWAS_SECTION_REPLACE:
      return {
        ...state,
        pwaSections: [
          action.payload,
          ...state.pwaSections.filter(
            (x) => x.category !== action.payload.category
          ),
        ],
      }

    case PWAS_ADD:
      return {
        ...state,
        pwas: [...state.pwas, ...action.payload],
      }

    case DEV_ADD:
      return {
        ...state,
        devs: [...state.devs, action.payload],
      }

    case HOME_SET:
      return {
        ...state,
        home: action.payload,
      }

    case REDUX_RESET:
      return { ...DEFAULT_STATE_PWAS }

    default:
      return state
  }
}

export { DEFAULT_STATE_PWAS, pwasReducer }
