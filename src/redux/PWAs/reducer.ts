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
}

const pwasReducer = (
  state = DEFAULT_STATE_PWAS as PWAsState,
  action: PWAsActionTypes | AppActionTypes
): PWAsState => {
  switch (action.type) {
    case PWAS_PENDING:
      return { ...state, isPending: true }

    case PWAS_COMPLETE:
      return { ...state, isPending: false }

    case RATINGS_PENDING:
      return { ...state, isRatingsPending: true }
    case RATINGS_ADD:
      const oldPwa = state.pwas.find((x) => x.appId === action.payload.appId)
      if (!oldPwa) return state
      const newPwa = {
        ...oldPwa,
        ratings: [...oldPwa.ratings, action.payload.ratings],
      } as PWA
      return {
        ...state,
        pwas: [
          ...state.pwas.filter((x) => x.appId !== action.payload.appId),
          newPwa,
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
