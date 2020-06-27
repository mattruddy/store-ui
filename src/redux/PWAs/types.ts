import {
  PWA,
  HomePWAs,
  Rating,
  NewRating,
  PublicProfile,
  AppRatings,
} from "../../util/types"

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
  isDevPending: boolean
  devs: PublicProfile[]
}

export const PWAS_PENDING = "PWAS_PENDING"
export const PWAS_COMPLETE = "PWAS_COMPLETE"
export const RATINGS_PENDING = "RATINGS_PENDING"
export const DEV_PENDING = "DEV_PENDING"
export const DEV_COMPLETE = "DEV_COMPLETE"
export const RATINGS_COMPLETE = "RATINGS_COMPLETE"
export const RATINGS_ADD = "RATINGS_ADD"
export const PWAS_SECTION_ADD = "PWAS_SECTION_ADD"
export const PWAS_SECTION_REPLACE = "PWAS_SECTION_REPLACE"
export const HOME_SET = "HOME_SET"
export const PWAS_ADD = "PWAS_ADD"
export const PWA_REPLACE = "PWAS_REPLACE"
export const PWAS_DATA = "PWAS_DATA"
export const RATING_ADD = "RATING_ADD"
export const DEV_ADD = "DEV_ADD"
export const DEV_REPLACE = "DEV_REPLACE"

export interface AddPWAsSectionAction {
  type: typeof PWAS_SECTION_ADD
  payload: PWASection
}

export interface AddPWAsAction {
  type: typeof PWAS_ADD
  payload: PWA[]
}

export interface AddDevAction {
  type: typeof DEV_ADD
  payload: PublicProfile
}

export interface PWASDataAction {
  type: typeof PWAS_DATA
  payload: Partial<PWAsState>
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
  payload: { ratings: AppRatings; appId: number }
}

export interface AddRatingAction {
  type: typeof RATING_ADD
  payload: { newRating: NewRating; appId: number }
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

export interface LoadingDevAction {
  type: typeof DEV_PENDING
}

export interface CompleteDevAction {
  type: typeof DEV_COMPLETE
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
  | PWASDataAction
  | AddRatingAction
  | AddDevAction
  | CompleteDevAction
  | LoadingDevAction
