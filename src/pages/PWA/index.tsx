import React, { useState, memo, Fragment, useEffect, useCallback } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  useIonViewDidEnter,
  IonBackButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonTitle,
} from "@ionic/react"
import {
  thunkGetPWAFromName,
  thunkGetRatings,
  thunkAddRating,
  thunkGetDev,
} from "../../redux/PWAs/actions"
import { RouteComponentProps, withRouter } from "react-router"
import { ScreenshotSlider, PWAInfo } from "../../components"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { PWA as PWAType } from "../../util/types"

const stars = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]

interface MatchParams {
  pwaName: string
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

const PWA: React.FC<OwnProps> = ({
  match: {
    params: { pwaName },
  },
}) => {
  const [notFound, setNotFound] = useState<boolean>(false)
  const [hasFetchedRatings, setHasFetchedRatings] = useState<boolean>(false)

  const findPWA = (pwas: PWAType[]) =>
    pwas.find((x) => {
      return pwaName.replace(/-/g, " ").toLowerCase() === x.name.toLowerCase()
    })

  const { pwa, dev, isLoggedIn } = useSelector(
    ({ pwas: { pwas, devs }, user: { isLoggedIn } }: ReduxCombinedState) => ({
      pwa: findPWA(pwas),
      dev: devs.find((x) => x.username === findPWA(pwas)?.username),
      isLoggedIn: isLoggedIn,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const addPWA = useCallback(
    async (name: string) => dispatch(thunkGetPWAFromName(name)),
    [dispatch]
  )
  const getRatings = useCallback(
    async (appId: number) => dispatch(thunkGetRatings(appId)),
    [dispatch]
  )
  const addRating = useCallback(
    async (appId: number, starValue: string, comment?: string) =>
      dispatch(thunkAddRating(appId, starValue, comment)),
    [dispatch]
  )

  const addDev = useCallback(
    async (username: string) => dispatch(thunkGetDev(username)),
    [dispatch]
  )

  useEffect(() => {
    ;(async () => {
      if (!notFound) {
        if (!pwa) {
          const fetchedPwa = await addPWA(pwaName)
          if (!fetchedPwa) {
            setNotFound(true)
          }
        }
      }
    })()
  }, [pwa, notFound])

  // Set the developer.
  useEffect(() => {
    ;(async () => {
      if (pwa && pwa.username) {
        if (!dev) {
          await addDev(pwa.username)
        }
      }
    })()
  }, [pwa, dev])

  useIonViewDidEnter(() => {
    ReactGA.pageview(pwaName)
  }, [])

  const onRatingSubmit = async (star: number, comment?: string) => {
    if (pwa) {
      const starVal = stars[star - 1]
      addRating(pwa.appId, starVal, comment)
    }
  }

  useEffect(() => {
    if (!pwa) return
    if (
      !hasFetchedRatings &&
      pwa.appRatings &&
      pwa.appRatings.ratings.length < 1
    ) {
      setHasFetchedRatings(true)
      getRatings(pwa.appId)
    }
  }, [pwa, hasFetchedRatings])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          {pwa && (
            <IonTitle>
              <h1 className="h1-title">{pwa.name}</h1>
            </IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonGrid fixed>
          <IonRow>
            {pwa ? (
              <Fragment>
                <IonCol size="12">
                  <PWAInfo
                    pwa={pwa}
                    isMyPwa={false}
                    onStar={onRatingSubmit}
                    isLoggedIn={isLoggedIn}
                  />
                </IonCol>
                <IonCol size="12">
                  <ScreenshotSlider images={pwa.screenshots} />
                </IonCol>
              </Fragment>
            ) : (
              notFound && (
                <IonCol>
                  <h1 className="HomeCardsHeader">PWA Store</h1>
                  <IonNote color="danger">App not found</IonNote>
                </IonCol>
              )
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default memo(PWA)
