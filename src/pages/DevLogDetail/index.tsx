import React, { useState, useEffect } from "react"
import { Axios } from "../../redux/Actions"
import { useParams } from "react-router"
import { DevLog, NewRating } from "../../util/types"
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import DevLogCard from "../../components/DevLogCard"
import { useSelector, shallowEqual } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"

const DevLogDetail: React.FC = () => {
  const [devLog, setDevLog] = useState<DevLog>()
  const { appName, id } = useParams()

  const { isLoggedIn, username } = useSelector(
    ({ user: { isLoggedIn, username } }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
      username,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (appName && id) {
      ;(async () => {
        const resp = await (await Axios()).get(
          `${!isLoggedIn ? "public" : "secure"}/log/${id}`
        )
        setDevLog(resp.data as DevLog)
      })()
    }
  }, [appName, id, isLoggedIn])

  const handleLike = async (logId: number) => {
    const resp = await (await Axios()).post(`secure/log/${logId}`)
    const like = resp.data as NewRating
    let nDevLog
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
      setDevLog(nDevLog)
    }
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          {devLog && (
            <IonTitle>
              <h1 className="h1-title">DevLog - {devLog.appName}</h1>
            </IonTitle>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        <IonGrid>
          <IonRow>
            <IonCol>
              {devLog && (
                <DevLogCard
                  isRouted={false}
                  isLinkable={true}
                  devLog={devLog}
                  onLike={handleLike}
                />
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default DevLogDetail
