import { getWindowDimensions, WindowDimensions } from "./utils"
import { SET_WINDOW, WindowActionTypes, WindowState } from "./types"

const DEFAULT_STATE_WINDOW: WindowState = {
  ...getWindowDimensions(),
}

const windowReducer = (
  state = DEFAULT_STATE_WINDOW,
  action: WindowActionTypes
): WindowState => {
  switch (action.type) {
    case SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, windowReducer }
