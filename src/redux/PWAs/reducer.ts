import { PWAsActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"
import { PWA } from "../../util/types"
import { Reducer } from "redux"

export interface PWAsState {
  count?: number
  next?: string
  previous?: string
  items: PWA[]
  isPending: boolean
  error?: string
  search?: string
}

const DEFAULT_STATE_PWAS: PWAsState = {
  count: undefined,
  next: undefined,
  previous: undefined,
  items: [],
  isPending: false,
  error: undefined,
  search: "",
}

const PWAs: Reducer<PWAsState> = (state = DEFAULT_STATE_PWAS, action) => {
  const { id, type, payload } = action
  switch (type) {
    case PWAsActionTypes.PWAS_PENDING:
      return { ...state, isPending: true }

    case PWAsActionTypes.PWAS_COMPLETE:
      return { ...state, isPending: false }

    case PWAsActionTypes.PWAS_SET:
      return { ...state, items: payload }

    case AppActionTypes.REDUX_RESET:
      return { ...DEFAULT_STATE_PWAS, items: [] }

    default:
      return state
  }
}

export { DEFAULT_STATE_PWAS, PWAs }
