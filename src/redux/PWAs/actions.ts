import { PWAS_PENDING, PWAS_COMPLETE, PWAS_SET } from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import { PWA } from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const setPWAs = (data: PWA[]) => ({ type: PWAS_SET, payload: data })

const thunkGetPWAs = (
  page: number,
  category?: string
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch
) => {
  dispatch(loadingPWAs())
  const url = category
    ? `/public/pwas/${page}/${category}`
    : `/public/pwas/${page}`

  try {
    const response = await Axios(url)
    const data: PWA[] = response.data
    dispatch(setPWAs(data))
    dispatch(completePWAs())
    return data
  } catch (e) {
    return console.log(e)
  }
}

export { thunkGetPWAs }
