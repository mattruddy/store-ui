import { getWindowDimensions, WindowDimensions } from "./utils"
import { SET_WINDOW, WindowActionTypes } from "./types"

export interface WindowState {
  dimensions: WindowDimensions | undefined
}

const DEFAULT_STATE_WINDOW: WindowState = {
  dimensions: getWindowDimensions(),
}

const windowReducer = (
  state = DEFAULT_STATE_WINDOW,
  action: WindowActionTypes
): WindowState => {
  switch (action.type) {
    case SET_WINDOW:
      return { ...state, dimensions: getWindowDimensions() }

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, windowReducer }
