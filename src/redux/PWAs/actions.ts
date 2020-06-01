import {
  PWAS_PENDING,
  PWAS_COMPLETE,
  HOME_SET,
  PWAS_ADD,
  PWASection,
  PWAS_SECTION_ADD,
  PWAS_SECTION_REPLACE,
  RATINGS_PENDING,
  RATINGS_COMPLETE,
  RATINGS_ADD,
  PWAsState,
  PWAS_DATA,
  RATING_ADD,
} from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { PWA, HomePWAs, Rating, NewRating } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"
import ReactGA from "react-ga"
import { useState } from "react"
import { setAlert } from "../Alerts/actions"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const loadingRatings = () => ({ type: RATINGS_PENDING })

const completeRatings = () => ({ type: RATINGS_COMPLETE })

const addRatings = (ratings: Rating[], appId: number) => ({
  type: RATINGS_ADD,
  payload: { ratings, appId },
})

const addRating = (newRating: NewRating, appId: number) => ({
  type: RATING_ADD,
  payload: { newRating, appId },
})

const addPWASection = (data: PWASection) => ({
  type: PWAS_SECTION_ADD,
  payload: data,
})

const replacePWASection = (data: PWASection) => ({
  type: PWAS_SECTION_REPLACE,
  payload: data,
})

const pwasData = (data: Partial<PWAsState>) => ({
  type: PWAS_DATA,
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
): ThunkAction<void, ReduxCombinedState, null, Action> => async (dispatch) => {
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

const thunkGetRatings = (
  appId: number
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch
) => {
  dispatch(loadingRatings)
  try {
    const url = `/public/pwa/${appId}/ratings`
    const axiosInstance = await Axios()
    const response = await axiosInstance.get(url)
    const data: Rating[] = response.data
    dispatch(addRatings(data, appId))
    return data
  } catch (e) {
    console.error(e)
    return undefined
  } finally {
    dispatch(completeRatings())
  }
}

const thunkAddRating = (
  appId: number,
  starValue: string,
  comment?: string
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch
) => {
  dispatch(loadingRatings())
  try {
    const url = `/public/pwa/rating/${appId}`
    const axiosInstance = await Axios()
    const requestData = comment
      ? { star: starValue, comment: comment }
      : { star: starValue }
    if (comment) {
      ReactGA.event({
        category: "comment",
        action: `User added comment`,
      })
    } else {
      ReactGA.event({
        category: "rating",
        action: `User added rating`,
      })
    }
    const response = await axiosInstance.post(url, requestData)
    const { data } = response
    dispatch(addRating(data as NewRating, appId))
    dispatch(
      setAlert({
        message: `Comment Added`,
        apiResponseStatus: response.status,
        timeout: 3000,
        show: true,
        status: "success",
      })
    )
    return data
  } catch (e) {
    console.log(e.response)
    dispatch(
      setAlert({
        message: e.response.data.message,
        apiResponseStatus: e.response.status,
        timeout: 3000,
        show: true,
        status: "fail",
      })
    )
    return undefined
  } finally {
    dispatch(completeRatings())
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
      const joint = [...data.discoverApps, ...data.newApps, ...data.topApps]
      dispatch(
        addPWAs(
          joint
            .filter((x, i) => joint.indexOf(x) === i)
            .filter((x) => !pwas.includes(x))
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

export {
  thunkGetPWAs,
  thunkGetHomeData,
  thunkGetPWAFromName,
  thunkGetRatings,
  thunkAddRating,
}
