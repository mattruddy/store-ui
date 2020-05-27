import { PWA, HomePWAs } from "../../util/types"

export interface PWASection {
  category: string
  items: PWA[]
  page: number
}

export interface PWAsState {
  count: number
  next: ""
  previous: ""
  pwaSections: PWASection[]
  isPending: boolean
  error: ""
  search: string
  home: HomePWAs
}

export const PWAS_PENDING = "PWAS_PENDING"
export const PWAS_COMPLETE = "PWAS_COMPLETE"
export const PWAS_ADD = "PWAS_ADD"
export const PWAS_REPLACE = "PWAS_REPLACE"
export const HOME_SET = "HOME_SET"

export interface AddPWAsAction {
  type: typeof PWAS_ADD
  payload: PWASection
}

export interface ReplacePWAsAction {
  type: typeof PWAS_REPLACE
  payload: PWASection
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
  | ReplacePWAsAction
  | AddPWAsAction
  | CompletePWAsAction
  | LoadingPWAsAction
  | SetHomeDataAction
