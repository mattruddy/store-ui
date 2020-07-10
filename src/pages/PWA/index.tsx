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
  IonCard,
  IonCardContent,
  useIonViewDidLeave,
} from "@ionic/react"
import {
  thunkGetPWAFromName,
  thunkGetRatings,
  thunkAddRating,
  thunkGetDev,
} from "../../redux/PWAs/actions"
import { RouteComponentProps } from "react-router"
import { ScreenshotSlider, PWAInfo } from "../../components"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { PWA as PWAType, DevLog, NewRating } from "../../util/types"
import StarsListModal from "../../components/StarsListModal"
import { Axios } from "../../redux/Actions"
import DevLogCard from "../../components/DevLogCard"
import { thunkRemoveDevLog } from "../../redux/User/actions"

const stars = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]

interface MatchParams {
  appName: string
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

const PWA: React.FC<OwnProps> = ({
  match: {
    params: { appName },
  },
}) => {
  const [notFound, setNotFound] = useState<boolean>(false)
  const [hasFetchedRatings, setHasFetchedRatings] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [devLogs, setDevLogs] = useState<DevLog[]>([])

  const findPWA = (pwas: PWAType[]) =>
    pwas.find((x) => {
      return appName.replace(/-/g, " ").toLowerCase() === x.name.toLowerCase()
    })

  const { pwa, dev, isLoggedIn, username } = useSelector(
    ({
      pwas: { pwas, devs },
      user: { isLoggedIn, username },
    }: ReduxCombinedState) => ({
      pwa: findPWA(pwas),
      dev: devs.find((x) => x.username === findPWA(pwas)?.username),
      isLoggedIn: isLoggedIn,
      username,
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
    async (appId: number) => dispatch(thunkAddRating(appId)),
    [dispatch]
  )
  const addDev = useCallback(
    async (username: string) => dispatch(thunkGetDev(username)),
    [dispatch]
  )
  const deleteDevLog = useCallback(
    (logId: number) => dispatch(thunkRemoveDevLog(logId)),
    [dispatch]
  )

  useEffect(() => {
    ;(async () => {
      if (!notFound) {
        if (!pwa) {
          const fetchedPwa = await addPWA(appName)
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
    ReactGA.pageview(appName)
  }, [])

  useEffect(() => {
    if (pwa) {
      ;(async () => {
        const resp = await (await Axios()).get(
          `${isLoggedIn ? "secure" : "public"}/dev-logs/app/${pwa.appId}`
        )
        setDevLogs(resp.data as DevLog[])
      })()
    }
    return () => {
      setDevLogs([])
    }
  }, [pwa, isLoggedIn])

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

  const handleRemoveDevLog = (logId: number) => {
    deleteDevLog(logId)
    setDevLogs((prev) => prev.filter((x) => x.logId !== logId))
  }

  const handleLike = async (logId: number) => {
    const resp = await (await Axios()).post(`secure/log/${logId}`)
    const like = resp.data as NewRating
    const devLog = devLogs.find((x) => x.logId === logId)
    let nDevLog: DevLog
    if (devLog) {
      if (like.liked) {
        nDevLog = {
          ...devLog,
          appLikes: {
            hasRated: like.liked,
            ratings: [like.rating, ...devLog.appLikes.ratings],
          },
        } as DevLog
      } else {
        nDevLog = {
          ...devLog,
          appLikes: {
            hasRated: like.liked,
            ratings: devLog.appLikes.ratings.filter(
              (x) => x.from.toLowerCase() !== username.toLowerCase()
            ),
          },
        } as DevLog
      }
      setDevLogs((prev) =>
        prev
          .filter((x) => x.logId !== logId)
          .concat(nDevLog)
          .sort(
            (a, b) =>
              new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
          )
      )
    }
  }

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
        <IonGrid>
          <IonRow>
            {pwa ? (
              <Fragment>
                <IonCol size="12">
                  <PWAInfo
                    pwa={pwa}
                    isMyPwa={false}
                    onStar={addRating}
                    isLoggedIn={isLoggedIn}
                    openModal={() => setIsOpen(true)}
                  />
                </IonCol>
                <IonCol
                  size="12"
                  sizeMd={devLogs.length > 0 ? "6" : "12"}
                  pushMd={devLogs.length > 0 ? "6" : "0"}
                >
                  <IonCard className="line-around">
                    <IonCardContent>
                      <ScreenshotSlider images={pwa.screenshots} />
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                {devLogs.length > 0 && (
                  <IonCol size="12" sizeMd="6" pullMd="6">
                    {devLogs.map((log, idx) => (
                      <DevLogCard
                        key={idx}
                        devLog={log}
                        isLinkable={false}
                        onDelete={handleRemoveDevLog}
                        onLike={handleLike}
                      />
                    ))}
                  </IonCol>
                )}
              </Fragment>
            ) : (
              notFound && (
                <IonCol>
                  <h1 className="HomeCardsHeader">Progressive App Store</h1>
                  <IonNote color="danger">App not found</IonNote>
                </IonCol>
              )
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
      {pwa && pwa.appRatings && (
        <StarsListModal
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
          ratings={pwa.appRatings.ratings}
        />
      )}
    </IonPage>
  )
}

export default memo(PWA)
