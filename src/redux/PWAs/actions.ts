import {
  PWAS_PENDING,
  PWAS_COMPLETE,
  HOME_SET,
  PWAS_ADD,
  PWASection,
  PWAS_SECTION_ADD,
  PWAS_SECTION_REPLACE,
} from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { PWA, HomePWAs } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const addPWASection = (data: PWASection) => ({
  type: PWAS_SECTION_ADD,
  payload: data,
})

const replacePWASection = (data: PWASection) => ({
  type: PWAS_SECTION_REPLACE,
  payload: data,
})

const addPWAs = (data: PWA[]) => ({ type: PWAS_ADD, payload: data })

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
      pwas: { pwas },
    } = getState()

    const pwaSection = pwaSections.find(
      (x) => x.category === category && x.page === page
    )
    if (pwaSection) {
      return pwaSection.appId.map((x) => pwas.find((y) => y.appId === x)) ?? []
    } else {
      const url = category
        ? `/public/pwas/${page}/${category}`
        : `/public/pwas/${page}`

      const axiosInstance = await Axios()
      const response = await axiosInstance.get(url)
      const newPwas: PWA[] = response.data
      const newPWAsSection = {
        appId: newPwas.map((x) => x.appId),
        category: category,
        page: page,
      } as PWASection
      const pwasToAdd = newPwas.filter((x) => !pwas.includes(x))
      dispatch(addPWAs(pwasToAdd))
      if (reload) {
        dispatch(replacePWASection(newPWAsSection))
      } else {
        dispatch(addPWASection(newPWAsSection))
      }
      return newPwas
    }
  } catch (e) {
    return console.log(e)
  } finally {
    dispatch(completePWAs())
  }
}

const thunkGetPWAFromName = (
  name: string
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch
) => {
  dispatch(loadingPWAs)
  try {
    const url = `/public/pwa/${name}`
    const axiosInstance = await Axios()
    const response = await axiosInstance.get(url)
    const data: PWA = response.data
    dispatch(addPWAs([data]))
    return data
  } catch (e) {
    console.log("no pwa here")
    console.error(e)
    return undefined
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
    pwas: { pwas },
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
      dispatch(
        addPWAs(
          [...home.discoverApps, ...home.newApps, ...home.topApps].filter(
            (x) => !pwas.includes(x)
          )
        )
      )
      return data
    }
  } catch (e) {
    return console.log(e)
  } finally {
    dispatch(completePWAs())
  }
}

export { thunkGetPWAs, thunkGetHomeData, thunkGetPWAFromName }
