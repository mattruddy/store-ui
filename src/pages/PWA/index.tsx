import React, { useState, memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
  useIonViewDidLeave,
  IonBackButton,
  IonButtons,
  IonToast,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { getPWA, postRating } from "../../data/dataApi"
import { RouteComponentProps, withRouter } from "react-router"
import {
  PWA as PWAType,
  Rating as RatingType,
  NewRating,
} from "../../util/types"
import { connect } from "../../data/connect"
import { setHasReadInstall } from "../../data/user/user.actions"
import { ScreenshotSlider, Rating, PWAInfo, RatingItem } from "../../components"
import ReactGA from "react-ga"

const stars = ["ONE", "TWO", "THREE", "FOUR", "FIVE"]

interface MatchParams {
  id: string | undefined
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

interface StateProps {
  hasRead?: string
}

interface DispatchProps {
  setHasReadInstall: typeof setHasReadInstall
}

type PWAProps = OwnProps & StateProps & DispatchProps

const PWA: React.FC<PWAProps> = ({
  match,
  history,
  hasRead,
  setHasReadInstall,
}) => {
  const [pwa, setPwa] = useState<PWAType | undefined>(undefined)
  const [ratings, setRatings] = useState<RatingType[]>([])
  const [currentStar, setCurrentStar] = useState<number>()
  const [starCount, setStarCount] = useState<number>()

  useIonViewDidEnter(() => {
    loadPWA(history.location.pathname.split("/")[2])
    ReactGA.pageview(history.location.pathname.split("/")[2])
  }, [])

  useIonViewDidLeave(() => {
    setPwa(undefined)
    setRatings([])
    setCurrentStar(undefined)
    setStarCount(undefined)
  }, [])

  const loadPWA = async (name: string) => {
    const resp = (await getPWA(name)) as PWAType
    setPwa(resp)
    setRatings(resp.ratings)
    setCurrentStar(resp.averageRating)
    setStarCount(resp.ratingsCount)
  }

  const onRatingSubmit = async (star: number, comment?: string) => {
    if (pwa) {
      const starVal = stars[star - 1]
      const response = (await postRating(
        starVal,
        pwa?.appId,
        comment
      )) as NewRating
      if (response && response.rating) {
        if (response.rating.comment) {
          setRatings([response.rating, ...ratings])
        }
        setCurrentStar(response.averageStar)
        setStarCount(response.ratingCount)
      }
    }
  }

  return (
    <IonPage>
      {pwa && (
        <>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/pwas" />
              </IonButtons>
              {<IonTitle>{pwa.name}</IonTitle>}
            </IonToolbar>
          </IonHeader>
          <IonContent class="content">
            <IonGrid fixed>
              <IonRow>
                <IonCol size="12">
                  <PWAInfo
                    pwa={pwa}
                    appId={pwa.appId}
                    currentStar={currentStar as number}
                    starCount={starCount as number}
                  />
                </IonCol>

                <IonCol size="12">
                  <h2 style={{ paddingLeft: "10px" }}>Screenshots</h2>
                </IonCol>

                {pwa.screenshots && (
                  <IonCol size="12">
                    <ScreenshotSlider screenshots={pwa.screenshots} />
                  </IonCol>
                )}
                <IonCol size="12">
                  <h2 style={{ paddingLeft: "10px" }}>Reviews</h2>
                </IonCol>
                <IonCol size="12">
                  <Rating onSubmit={onRatingSubmit} />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonList>
                    {ratings && ratings.length > 0 ? (
                      ratings.map((rating, idx) => (
                        <RatingItem key={idx} rating={rating} />
                      ))
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
                    )}
                  </IonList>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonToast
            isOpen={hasRead !== undefined && hasRead === "false"}
            position="top"
            color="dark"
            message="Please click to learn how to install a PWA"
            buttons={[
              {
                text: "Close",
                handler: () => {
                  setHasReadInstall("true")
                },
              },
              {
                text: "Learn",
                handler: () => {
                  setHasReadInstall("true")
                  history.push("/about")
                },
              },
            ]}
          />
        </>
      )}
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    hasRead: state.user.hasRead,
  }),
  mapDispatchToProps: {
    setHasReadInstall,
  },
  component: withRouter(memo(PWA)),
})
