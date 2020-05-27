import { WindowDimensions } from "./utils"

export const SET_WINDOW = "SET_WINDOW"

export interface WindowState {
  dimensions: WindowDimensions | undefined
}

export interface SetWindowAction {
  type: typeof SET_WINDOW
}

export type WindowActionTypes = SetWindowAction
