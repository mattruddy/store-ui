import { PWAS_PENDING, PWAS_COMPLETE, PWAS_SET, HOME_SET } from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { PWA, HomePWAs } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const setPWAs = (data: PWA[]) => ({ type: PWAS_SET, payload: data })

const setHomeData = (data: HomePWAs) => ({
  type: HOME_SET,
  payload: data,
})

const thunkGetPWAs = (
  page: number,
  category?: string,
  reload?: boolean
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch
) => {
  dispatch(loadingPWAs())
  const url = category
    ? `/public/pwas/${page}/${category}`
    : `/public/pwas/${page}`

  try {
    const axiosInstance = await Axios()
    const response = await axiosInstance.get(url)
    const data: PWA[] = response.data
    dispatch(setPWAs(data))
    dispatch(completePWAs())
    return data
  } catch (e) {
    return console.log(e)
  }
}

const thunkGetHomeData = (
  reload?: boolean
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
