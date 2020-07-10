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
  RATING_ADD,
  DEV_ADD,
  DEV_PENDING,
  DEV_COMPLETE,
  RATING_REMOVE,
} from "./types"
import { Axios } from "../Actions"
import { Action } from "redux"
import { ThunkAction } from "redux-thunk"
import {
  PWA,
  HomePWAs,
  NewRating,
  PublicProfile,
  AppRatings,
} from "../../util/types"
import { ReduxCombinedState } from "../RootReducer"
import ReactGA from "react-ga"
import { setAlert } from "../Alerts/actions"
import { thunkRemoveStarred, thunkAppStarred } from "../User/actions"
import { USER_ADD_LIKE_LOG, USER_REMOVE_LIKE_LOG } from "../User/types"

const loadingPWAs = () => ({ type: PWAS_PENDING })

const completePWAs = () => ({ type: PWAS_COMPLETE })

const loadingRatings = () => ({ type: RATINGS_PENDING })

const completeRatings = () => ({ type: RATINGS_COMPLETE })

const loadingDev = () => ({ type: DEV_PENDING })

const completeDev = () => ({ type: DEV_COMPLETE })

const addRatings = (ratings: AppRatings, appId: number) => ({
  type: RATINGS_ADD,
  payload: { ratings, appId },
})

const addRating = (newRating: NewRating, appId: number) => ({
  type: RATING_ADD,
  payload: { newRating, appId },
})

const removeRating = (appId: number, username: string) => ({
  type: RATING_REMOVE,
  payload: { appId, username },
})

const addPWASection = (data: PWASection) => ({
  type: PWAS_SECTION_ADD,
  payload: data,
})

const addDev = (data: PublicProfile) => ({
  type: DEV_ADD,
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
    return console.error(e)
  } finally {
    dispatch(completePWAs())
  }
}

const thunkGetPWAFromName = (
  name: string
): ThunkAction<void, ReduxCombinedState, null, Action> => async (
  dispatch,
  getState
) => {
  const {
    pwas: { pwas },
  } = getState()
  const pwa = pwas.find((x) => x.name === name)
  if (pwa) return pwa
  dispatch(loadingPWAs())
  try {
    const url = `/public/pwa/${name}`
    const axiosInstance = await Axios()
    const response = await axiosInstance.get(url)
    const data: PWA = response.data
    dispatch(addPWAs([data]))
    return data
  } catch (e) {
    console.error(e)
    return undefined
  } finally {
    dispatch(completePWAs())
  }
}

const thunkGetRatings = (
  appId: number
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const {
    user: { isLoggedIn },
  } = getState()
  dispatch(loadingRatings())
  try {
    const url = `/${isLoggedIn ? "secure" : "public"}/pwa/${appId}/ratings`
    const axiosInstance = await Axios()
    const response = await axiosInstance.get(url)
    const data: AppRatings = response.data
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
  appId: number
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const {
    user: { isLoggedIn, username },
  } = getState()
  dispatch(loadingRatings())
  try {
    if (!isLoggedIn) {
      return
    }
    const url = `/secure/pwa/rating/${appId}`
    const axiosInstance = await Axios()
    ReactGA.event({
      category: "rating",
      action: `User starred`,
    })
    const response = await axiosInstance.post(url, {})
    const { data } = response
    const rating = data as NewRating
    let pwa = getState().pwas.pwas.find((x) => x.appId === appId)
    let isMyApp = false
    if (!pwa) {
      pwa = getState().user.pwas.find((x) => x.appId === appId)
      isMyApp = true
    }
    if (rating.liked) {
      dispatch(addRating(rating, appId))
      if (pwa) {
        pwa.ratingsCount = pwa!.ratingsCount + 1
        dispatch(thunkAppStarred(pwa, rating, isMyApp))
      }
    } else {
      dispatch(removeRating(appId, username))
      if (pwa) {
        pwa.ratingsCount = pwa.ratingsCount - 1
        pwa.appRatings.hasRated = false
        pwa.appRatings.ratings = pwa.appRatings.ratings.filter(
          (x) => x.from.toLowerCase() !== username.toLowerCase()
        )
        dispatch(thunkRemoveStarred(pwa.appId, isMyApp))
      }
    }
    return data
  } catch (e) {
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
      const joint = [
        ...data.discoverApps,
        ...data.featuredApps,
        ...data.topApps,
      ]
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
    return console.error(e)
  } finally {
    dispatch(completePWAs())
  }
}

const thunkGetDev = (
  username: string
): ThunkAction<void, ReduxCombinedState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  const {
    pwas: { devs },
  } = getState()
  const dev = devs.find((x) => x.username === username)
  if (dev) return dev
  try {
    dispatch(loadingDev())
    const resp = await (await Axios()).get(`/public/profile/${username}`)
    const data = resp.data as PublicProfile
    dispatch(addDev(data))
    return data
  } catch (e) {
    console.error(e)
    return undefined
  } finally {
    dispatch(completeDev())
  }
}

export {
  thunkGetPWAs,
  thunkGetHomeData,
  thunkGetPWAFromName,
  thunkGetRatings,
  thunkAddRating,
  thunkGetDev,
}
