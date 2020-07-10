import React, { useState, useEffect } from "react"
import { Axios } from "../../redux/Actions"
import { useParams } from "react-router"
import { DevLog } from "../../util/types"
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

const DevLogDetail: React.FC = () => {
  const [devLog, setDevLog] = useState<DevLog>()
  const [loading, setLoading] = useState<boolean>(true)
  const { appName, id } = useParams()

  useEffect(() => {
    if (appName && id) {
      ;(async () => {
        const resp = await (await Axios()).get(`public/log/${id}`)
        setDevLog(resp.data as DevLog)
      })()
    }
  }, [appName, id])

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
