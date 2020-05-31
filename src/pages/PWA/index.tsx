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
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  IonBackButton,
  IonButtons,
  IonToast,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonNote,
  IonSpinner,
} from "@ionic/react"
import { thunkGetPWAFromName, thunkGetRatings } from "../../redux/PWAs/actions"
import { RouteComponentProps, withRouter } from "react-router"
import { Rating as RatingType, NewRating } from "../../util/types"
import { ScreenshotSlider, Rating, PWAInfo, RatingItem } from "../../components"
import { thunkSetHasReadInstall } from "../../redux/User/actions"
import { RouteMap } from "../../routes"
import ReactGA from "react-ga"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { Axios } from "../../redux/Actions"

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
  const [ratings, setRatings] = useState<RatingType[]>([])
  const [currentStar, setCurrentStar] = useState<number>()
  const [starCount, setStarCount] = useState<number>()
  const [notFound, setNotFound] = useState<boolean>(false)
  const [hasFetchedRatings, setHasFetchedRatings] = useState<boolean>(false)

  const { pwa, hasRead, isRatingsLoading } = useSelector(
    ({ pwas: { pwas, isRatingsPending }, user }: ReduxCombinedState) => ({
      pwa: pwas.find((x) => pwaName.replace(/-/g, " ") === x.name),
      hasRead: user.hasRead,
      isRatingsLoading: isRatingsPending,
    }),
    shallowEqual
  )
  const dispatch = useDispatch()
  const setHasReadInstall = useCallback(
    (hasRead: boolean) => dispatch(thunkSetHasReadInstall(hasRead)),
    [dispatch]
  )
  const addPWA = useCallback(
    async (name: string) => dispatch(thunkGetPWAFromName(name)),
    [dispatch]
  )
  const getRatings = useCallback(
    async (appId: number) => dispatch(thunkGetRatings(appId)),
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
        } else {
          setCurrentStar(pwa.averageRating)
          setStarCount(pwa.ratingsCount)
        }
      } else {
        console.log("Show that the app doesn't exist")
      }
    })()
  }, [pwa, notFound])

  useIonViewDidEnter(() => {
    loadRatings(pwaName)
    ReactGA.pageview(pwaName)
  }, [])

  useIonViewDidLeave(() => {
    setRatings([])
    setCurrentStar(undefined)
    setStarCount(undefined)
  }, [])

  const loadRatings = async (name: string) => {
    try {
      const axios = await Axios()
      const resp = await axios.get(`/public/pwa/${name}/ratings`)
      setRatings(resp.data as RatingType[])
    } catch (e) {
      console.log(e)
    }
  }

  const onRatingSubmit = async (star: number, comment?: string) => {
    // if (pwa) {
    //   const starVal = stars[star - 1]
    //   const response = (await postRating(
    //     starVal,
    //     pwa?.appId,
    //     comment
    //   )) as NewRating
    //   if (response && response.rating) {
    //     if (response.rating.comment) {
    //       ReactGA.event({
    //         category: "comment",
    //         action: `User added comment for ${pwa.name}`,
    //       })
    //       setRatings([response.rating, ...ratings])
    //     }
    //     setCurrentStar(response.averageStar)
    //     setStarCount(response.ratingCount)
    //     ReactGA.event({
    //       category: "rating",
    //       action: `User added rating for ${pwa.name}`,
    //     })
    //   }
    // }
  }

  const renderRatings = useMemo(() => {
    if (!pwa) return
    else if (!hasFetchedRatings && pwa.ratings.length < 1) {
      setHasFetchedRatings(true)
      console.log(`loading ratings: ${pwa.ratings}`)
      getRatings(pwa.appId)
    }

    return isRatingsLoading ? (
      <IonSpinner />
    ) : pwa.ratings.length > 0 ? (
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
  }, [pwa, isRatingsLoading, hasFetchedRatings])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonLabel style={{ marginRight: "10px" }} slot="end">
            PWA Store
          </IonLabel>
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
                    currentStar={currentStar as number}
                    starCount={starCount as number}
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
      <IonToast
        isOpen={!hasRead}
        position="top"
        color="dark"
        message="Please click to learn how to install a PWA"
        buttons={[
          {
            text: "Close",
            handler: () => {
              setHasReadInstall(true)
            },
          },
          {
            text: "Learn",
            handler: () => {
              setHasReadInstall(true)
              history.push(RouteMap.ABOUT)
            },
          },
        ]}
      />
    </IonPage>
  )
}

export default withRouter(memo(PWA))
