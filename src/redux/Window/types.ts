import { WindowDimensions } from "./utils"

export const SET_WINDOW = "SET_WINDOW"

export type WindowState = WindowDimensions

export interface SetWindowAction {
  type: typeof SET_WINDOW
}

export type WindowActionTypes = SetWindowAction
