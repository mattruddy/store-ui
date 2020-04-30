import React, { useState } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  useIonViewWillEnter,
  IonToolbar,
  IonTitle,
  IonBackButton,
  useIonViewDidEnter,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonItemDivider,
  IonItem,
  IonLabel,
  IonTextarea,
  IonImg,
} from "@ionic/react"
import { RouteComponentProps, withRouter } from "react-router"
import { getAllPending, postStatus } from "../data/dataApi"
import { PWA } from "../util/types"

interface MatchParams {
  id: string | undefined
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

interface StateProps {}

interface DispatchProps {}

type AdminProps = OwnProps & StateProps & DispatchProps

const Admin: React.FC<AdminProps> = ({ history }) => {
  const [pwas, setPwas] = useState<PWA[]>([])
  const [status, setStatus] = useState<string | undefined>()
  const [reason, setReason] = useState<string | undefined>()

  useIonViewWillEnter(() => {
    const me = localStorage.getItem("me")
    if (!me || me !== "mattruddy") {
      history.goBack()
    }
  })

  useIonViewDidEnter(async () => {
    const resp = await getAllPending()
    if (resp.data) {
      setPwas(resp.data)
    }
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {pwas &&
          pwas.map((pwa, idx) => {
            return (
              <div key={idx} style={{ padding: "30px" }}>
                <div>
                  <IonLabel>Name</IonLabel>
                  <IonItem>
                    <span>{pwa.name}</span>
                  </IonItem>
                  <IonLabel>Link</IonLabel>
                  <IonItem>
                    <IonButton
                      onClick={() => {
                        console.log("hey")
                      }}
                    >
                      Link
                    </IonButton>
                  </IonItem>
                  <IonLabel>Desc</IonLabel>
                  <IonItem>
                    <p>{pwa.description}</p>
                  </IonItem>
                  <IonLabel>Category</IonLabel>
                  <IonItem>
                    <span>{pwa.category}</span>
                  </IonItem>
                  <IonLabel>Icon</IonLabel>
                  <IonItem>
                    <IonImg alt="icon" src={pwa.icon} />
                  </IonItem>
                  <IonLabel>Screenshots</IonLabel>
                  <IonItem>
                    {pwa.screenshots.map((shot, idx) => (
                      <div key={idx}>
                        <IonImg alt="screenshot" src={shot.url} />
                      </div>
                    ))}
                  </IonItem>
                </div>
                <div>
                  <IonSelect
                    onIonChange={(e) => {
                      if (e.detail.value === "APPROVED") {
                        setReason(undefined)
                      }
                      setStatus(e.detail.value!)
                    }}
                    placeholder="Status"
                  >
                    <IonSelectOption value="APPROVED">APPROVED</IonSelectOption>
                    <IonSelectOption value="DENIED">DENIED</IonSelectOption>
                  </IonSelect>
                  {status && status === "DENIED" && (
                    <IonTextarea
                      value={reason}
                      placeholder="Please give a reason"
                      onIonChange={(e) => setReason(e.detail.value!)}
                      rows={4}
                    />
                  )}
                  <IonButton
                    onClick={async () => {
                      const resp = await postStatus(status!, pwa.appId, reason)
                      if (resp.status === 200) {
                        setStatus(undefined)
                        setReason(undefined)
                        setPwas(pwas.filter((app) => app.appId !== pwa.appId))
                      }
                    }}
                  >
                    Submit
                  </IonButton>
                </div>
              </div>
            )
          })}
      </IonContent>
    </IonPage>
  )
}

export default withRouter(Admin)
