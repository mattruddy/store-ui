import { SetApiResponseStatus, SetAlert } from "../Alerts/actions"
import { PWAsActionTypes } from "./types"
import { Axios } from "../Actions"
import { MiddlewareAPI } from "redux"
import ReactGA from "react-ga"
import { PWA } from "../../util/types"

const loadingPWAs = () => ({ type: PWAsActionTypes.PWAS_PENDING })

const completePWAs = () => ({ type: PWAsActionTypes.PWAS_COMPLETE })

const getPWAs = (page: number, category?: string) => (
  dispatch: MiddlewareAPI["dispatch"]
) => {
  dispatch(loadingPWAs())
  const url = category
    ? `/public/pwas/${page}/${category}`
    : `/public/pwas/${page}`

  return Axios(url)
    .then(({ data }) => {
      dispatch({ type: PWAsActionTypes.PWAS_SET, payload: data })
      dispatch(completePWAs())
      return data
    })

    .catch((e) => console.log(e))
}

export { getPWAs }
