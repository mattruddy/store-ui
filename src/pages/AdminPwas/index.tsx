import React, { useState, memo, useEffect, useMemo, Fragment } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonItem,
  IonLabel,
  IonTextarea,
  IonImg,
  IonRow,
  IonCol,
} from "@ionic/react"
import { withRouter } from "react-router"
import { PWA } from "../../util/types"
import { useSelector, shallowEqual } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { Axios } from "../../redux/Actions"

const AdminPwas: React.FC = () => {
  const [pwas, setPwas] = useState<PWA[]>([])
  const [status, setStatus] = useState<string | undefined>()
  const [reason, setReason] = useState<string | undefined>()

  const { isLoggedIn } = useSelector(
    ({ user: { isLoggedIn } }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
    }),
    shallowEqual
  )

  useEffect(() => {
    if (isLoggedIn) {
      ;(async () => {
        const resp = await (await Axios()).get(`admin/pwas`)
        if (resp.data) {
          setPwas(resp.data)
        }
      })()
    }
  }, [isLoggedIn])

  const renderAdmin = useMemo(
    () => (
      <Fragment>
        {isLoggedIn ? (
          pwas &&
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
                        window.open(pwa.link)
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
                      const resp = await (await Axios()).put(
                        `admin/pwa/${pwa.appId}`,
                        {
                          code: status,
                          reason: reason,
                        }
                      )
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
          })
        ) : (
          <IonRow>
            <IonCol sizeMd="8">
              <h1 className="HomeCardsHeader">Page Not Found</h1>
            </IonCol>
          </IonRow>
        )}
      </Fragment>
    ),
    [pwas, status, reason]
  )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{renderAdmin}</IonContent>
    </IonPage>
  )
}

export default memo(AdminPwas)
