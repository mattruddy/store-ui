import {
  PWAsActionTypes,
  PWAS_PENDING,
  PWAS_COMPLETE,
  PWAsState,
  HOME_SET,
  PWASection,
  PWAS_ADD,
  PWAS_REPLACE,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"
import { HomePWAs } from "../../util/types"

const DEFAULT_STATE_PWAS: PWAsState = {
  count: 0,
  next: "",
  previous: "",
  pwaSections: [] as PWASection[],
  isPending: false,
  error: "",
  search: "",
  home: { topApps: [], newApps: [], discoverApps: [] } as HomePWAs,
}

const pwasReducer = (
  state = DEFAULT_STATE_PWAS,
  action: PWAsActionTypes | AppActionTypes
): PWAsState => {
  switch (action.type) {
    case PWAS_PENDING:
      return { ...state, isPending: true }

    case PWAS_COMPLETE:
      return { ...state, isPending: false }

    case PWAS_ADD:
      return { ...state, pwaSections: [...state.pwaSections, action.payload] }

    case PWAS_REPLACE:
      return {
        ...state,
        pwaSections: [
          action.payload,
          ...state.pwaSections.filter(
            (x) => x.category !== action.payload.category
          ),
        ],
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
