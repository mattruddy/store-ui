import { WindowActionTypes } from "./types"
import { getWindowDimensions } from "./utils"
import { ActionProps } from "../Actions/propTypes"
import { Reducer } from "redux"

export interface WindowState {
  dimensions: any
}

const DEFAULT_STATE_WINDOW: WindowState = {
  dimensions: { ...getWindowDimensions() },
}

const Window: Reducer<WindowState> = (
  state = DEFAULT_STATE_WINDOW,
  action
): WindowState => {
  const { type, payload } = action
  switch (type) {
    case WindowActionTypes.SET_WINDOW:
      return { ...state, ...getWindowDimensions() }

    default:
      return state
  }
}

export { DEFAULT_STATE_WINDOW, Window }
