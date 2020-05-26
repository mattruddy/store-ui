import {
  PWAsActionTypes,
  PWAS_PENDING,
  PWAS_COMPLETE,
  PWAS_SET,
  PWAsState,
} from "./types"
import { AppActionTypes, REDUX_RESET } from "../App/types"

const DEFAULT_STATE_PWAS: PWAsState = {
  count: undefined,
  next: undefined,
  previous: undefined,
  items: [],
  isPending: false,
  error: undefined,
  search: "",
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

    case PWAS_SET:
      return { ...state, items: action.payload }

    case REDUX_RESET:
      return { ...DEFAULT_STATE_PWAS, items: [] }

    default:
      return state
  }
}

export { DEFAULT_STATE_PWAS, pwasReducer }
