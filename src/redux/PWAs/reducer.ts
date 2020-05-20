import { PWAsActionTypes } from "./types"
import { AppActionTypes } from "../App/types"
import { ActionProps } from "../Actions/propTypes"

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
    case AppActionTypes.REDUX_RESET:
      return { ...DEFAULT_STATE_PWAS, items: [] }

    default:
      return state
  }
}

export { DEFAULT_STATE_PWAS, PWAs }
