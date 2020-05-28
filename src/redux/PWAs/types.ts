import { PWA, HomePWAs } from "../../util/types"

export interface PWASection {
  category: string
  appId: number[]
  page: number
}

export interface PWAsState {
  count: number
  next: ""
  previous: ""
  pwaSections: PWASection[]
  pwas: PWA[]
  isPending: boolean
  error: ""
  search: string
  home: HomePWAs
}

export const PWAS_PENDING = "PWAS_PENDING"
export const PWAS_COMPLETE = "PWAS_COMPLETE"
export const PWAS_SECTION_ADD = "PWAS_SECTION_ADD"
export const PWAS_SECTION_REPLACE = "PWAS_SECTION_REPLACE"
export const HOME_SET = "HOME_SET"
export const PWAS_ADD = "PWAS_ADD"

export interface AddPWAsSectionAction {
  type: typeof PWAS_SECTION_ADD
  payload: PWASection
}

export interface AddPWAsAction {
  type: typeof PWAS_ADD
  payload: PWA[]
}

export interface ReplacePWAsSectionAction {
  type: typeof PWAS_SECTION_REPLACE
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
  | ReplacePWAsSectionAction
  | AddPWAsSectionAction
  | CompletePWAsAction
  | LoadingPWAsAction
  | SetHomeDataAction
  | AddPWAsAction
