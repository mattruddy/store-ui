import { createSelector } from "reselect"
import { AppState } from "./state"

const getPwas = (state: AppState) => state.user.pwas

const getIdParam = (_state: AppState, props: any) => {
  return props.match.params["id"]
}

export const getPwa = createSelector(getPwas, getIdParam, (pwas, pwaName) => {
  const removeDashName = pwaName.replace(/-/g, " ")
  return pwas?.find(
    (x) => x.name.toLowerCase() === removeDashName.toLowerCase()
  )
})
