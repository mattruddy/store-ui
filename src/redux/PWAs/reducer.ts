import { PWAsActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"
import { PWA } from "../../util/types"

export interface PWAsState {
  count?: number
  next?: string
  previous?: string
  items: PWA[]
  isPending?: boolean
  error?: string
  search?: string
}

const DEFAULT_STATE_PWAS = {
  count: null,
  next: null,
  previous: null,
  items: [],
  isPending: false,
  error: null,
  search: "",
}

const PWAs = (state = DEFAULT_STATE_PWAS, action: ActionProps) => {
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
