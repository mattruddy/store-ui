import { PWA, HomePWAs, Rating } from "../../util/types"

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
  isRatingsPending: boolean
}

export const PWAS_PENDING = "PWAS_PENDING"
export const PWAS_COMPLETE = "PWAS_COMPLETE"
export const RATINGS_PENDING = "RATINGS_PENDING"
export const RATINGS_COMPLETE = "RATINGS_COMPLETE"
export const RATINGS_ADD = "RATINGS_ADD"
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

export interface AddRatingsAction {
  type: typeof RATINGS_ADD
  payload: { ratings: Rating[]; appId: number }
}

export interface LoadingPWAsAction {
  type: typeof PWAS_PENDING
}

export interface CompleteRatingsAction {
  type: typeof RATINGS_COMPLETE
}

export interface LoadingRatingsAction {
  type: typeof RATINGS_PENDING
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
  | CompleteRatingsAction
  | LoadingRatingsAction
  | AddRatingsAction
