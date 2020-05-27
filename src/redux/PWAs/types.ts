import { PWA, HomePWAs } from "../../util/types"

export interface PWAsState {
  count: number
  next: ""
  previous: ""
  items: PWA[]
  isPending: boolean
  error: ""
  search: string
  home: HomePWAs
}

export const PWAS_PENDING = "PWAS_PENDING"
export const PWAS_COMPLETE = "PWAS_COMPLETE"
export const PWAS_SET = "PWAS_SET"
export const HOME_SET = "HOME_SET"

export interface SetPWAsAction {
  type: typeof PWAS_SET
  payload: PWA[]
}

export interface CompletePWAsAction {
  type: typeof PWAS_COMPLETE
}

export interface LoadingPWAsAction {
  type: typeof PWAS_PENDING
}

export interface SetHomeDataAction {
  type: typeof HOME_SET
  payload: HomePWAs
}

export type PWAsActionTypes =
  | SetPWAsAction
  | CompletePWAsAction
  | LoadingPWAsAction
  | SetHomeDataAction
