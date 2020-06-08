import React, {
  useState,
  useMemo,
  memo,
  Fragment,
  useEffect,
  useCallback,
} from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  useIonViewDidEnter,
  IonBackButton,
  IonButtons,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonSpinner,
  IonTitle,
} from "@ionic/react"
import {
  thunkGetPWAFromName,
  thunkGetRatings,
  thunkAddRating,
} from "../../redux/PWAs/actions"
import { RouteComponentProps, withRouter } from "react-router"
import { ScreenshotSlider, Rating, PWAInfo, RatingItem } from "../../components"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, shallowEqual, useDispatch } from "react-redux"

const stars = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]

interface MatchParams {
  pwaName: string
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

const PWA: React.FC<OwnProps> = ({
  match: {
    params: { pwaName },
  },
  history,
}) => {
  const [notFound, setNotFound] = useState<boolean>(false)
  const [hasFetchedRatings, setHasFetchedRatings] = useState<boolean>(false)

  const { pwa, isRatingsLoading } = useSelector(
    ({ pwas: { pwas, isRatingsPending }, user }: ReduxCombinedState) => ({
      pwa: pwas.find((x) => pwaName.replace(/-/g, " ") === x.name),
      isRatingsLoading: isRatingsPending,
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

  useIonViewDidEnter(() => {
    ReactGA.pageview(pwaName)
  }, [])

  const onRatingSubmit = async (star: number, comment?: string) => {
    if (pwa) {
      const starVal = stars[star - 1]
      addRating(pwa.appId, starVal, comment)
    }
  }

  const renderRatings = useMemo(() => {
    if (!pwa) return
    if (!hasFetchedRatings && pwa.ratings && pwa.ratings.length < 1) {
      setHasFetchedRatings(true)
      getRatings(pwa.appId)
    }
    return pwa.ratings.length > 0 ? (
      pwa.ratings.map((rating, i) => <RatingItem key={i} rating={rating} />)
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <p>
          <i>No Reviews Yet</i>
        </p>
      </div>
    )
  }, [pwa, hasFetchedRatings])

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          {pwa && <IonTitle>{pwa.name}</IonTitle>}
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
                    appId={pwa.appId}
                    currentStar={pwa.averageRating}
                    starCount={pwa.ratingsCount}
                    tags={pwa.tags}
                  />
                </IonCol>
                <IonCol size="12" sizeMd="6" pushMd="6">
                  <h2 style={{ paddingLeft: "10px" }}>Screenshots</h2>
                  <ScreenshotSlider images={pwa.screenshots} />
                </IonCol>
                <IonCol size="12" sizeMd="6" pullMd="6">
                  <h2 style={{ paddingLeft: "10px" }}>Reviews</h2>
                  <Rating onSubmit={onRatingSubmit} />
                  <IonList>{renderRatings}</IonList>
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

export default withRouter(memo(PWA))
