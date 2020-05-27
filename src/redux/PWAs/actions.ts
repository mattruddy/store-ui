import {
  PWAS_PENDING,
  PWAS_COMPLETE,
  HOME_SET,
  PWAS_ADD,
  PWASection,
  PWAS_REPLACE,
} from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { PWA, HomePWAs } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const addPWASection = (data: PWASection) => ({ type: PWAS_ADD, payload: data })

const replacePWASection = (data: PWASection) => ({
  type: PWAS_REPLACE,
  payload: data,
})

const setHomeData = (data: HomePWAs) => ({
  type: HOME_SET,
  payload: data,
})

const thunkGetPWAs = (
  page: number,
  category: string = "",
  reload: boolean = false
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  dispatch(loadingPWAs())
  try {
    const {
      pwas: { pwaSections },
    } = getState()

    const pwaSection = pwaSections.find(
      (x) => x.category === category && x.page === page
    )
    if (pwaSection) {
      return pwaSection.items
    } else {
      const url = category
        ? `/public/pwas/${page}/${category}`
        : `/public/pwas/${page}`

      const axiosInstance = await Axios()
      const response = await axiosInstance.get(url)
      const newPWAsSection = {
        items: response.data,
        category: category,
        page: page,
      } as PWASection
      if (reload) {
        dispatch(replacePWASection(newPWAsSection))
      } else {
        dispatch(addPWASection(newPWAsSection))
      }
      return newPWAsSection.items
    }
  } catch (e) {
    return console.log(e)
  } finally {
    dispatch(completePWAs())
  }
}

const thunkGetHomeData = (
  reload: boolean = false
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  dispatch(loadingPWAs())

  const {
    pwas: { home },
  } = getState()
  try {
    if (home.topApps.length > 0 && !reload) {
      return home
    } else {
      const url = `/public/home`

      const axiosInstance = await Axios()
      const response = await axiosInstance.get(url)
      const data: HomePWAs = response.data
      dispatch(setHomeData(data))
      return data
    }
  } catch (e) {
    return console.log(e)
  } finally {
    dispatch(completePWAs())
  }
}

export { thunkGetPWAs, thunkGetHomeData }
