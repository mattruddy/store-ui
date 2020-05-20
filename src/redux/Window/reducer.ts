import { WindowActionTypes } from "./types"
import { getWindowDimensions } from "./utils"
import { ActionProps } from "../Actions/propTypes"

const DEFAULT_STATE_WINDOW = {
  ...getWindowDimensions(),
}

const Window = (state = DEFAULT_STATE_WINDOW, action: ActionProps) => {
  const { type, payload } = action
  switch (type) {
    case WindowActionTypes.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
