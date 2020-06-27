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
  IonButtons,
  IonCheckbox,
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWA } from "../../util/types"
import { useSelector, shallowEqual } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { Axios } from "../../redux/Actions"
import {
  pencil,
  ellipsisVertical,
  notifications,
  newspaper,
  medal,
} from "ionicons/icons"
import { RouteMap } from "../../routes"
import Popover from "../../components/Popover"
import { FormItem } from "../../components"

const AdminPwas: React.FC = () => {
  const [pwas, setPwas] = useState<PWA[]>([])
  const [status, setStatus] = useState<string | undefined>()
  const [isTutorial, setIsTutorial] = useState<boolean>()
  const [reason, setReason] = useState<string | undefined>()
  const [showPopover, setShowPopover] = useState(false)
  const history = useHistory()

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

  const renderPopover = useMemo(
    () => (
      <Popover
        showPopover={showPopover}
        setShowPopover={setShowPopover}
        icon={ellipsisVertical}
        items={[
          {
            name: "Notifications",
            action: () => history.push(RouteMap.ADMIN_NOTIFY),
            icon: notifications,
          },
          {
            name: "App Approval",
            action: () => history.push(RouteMap.ADMIN_PWAS),
            icon: newspaper,
          },
          {
            name: "App Feature",
            action: () => history.push(RouteMap.ADMIN_FEATURE),
            icon: medal,
          },
        ]}
      />
    ),
    [showPopover]
  )

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
                  <FormItem name="Is Tutorial?">
                    <IonCheckbox
                      checked={isTutorial}
                      onIonChange={(e) => setIsTutorial(e.detail.checked)}
                    ></IonCheckbox>
                  </FormItem>

                  <IonButton
                    onClick={async () => {
                      const resp = await (await Axios()).put(
                        `admin/pwa/${pwa.appId}`,
                        {
                          code: status,
                          isTutorial: isTutorial,
                          reason: reason,
                        }
                      )
                      if (resp.status === 200) {
                        setStatus(undefined)
                        setReason(undefined)
                        setIsTutorial(false)
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
    [pwas, status, reason, isTutorial]
  )

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Approval Admin</IonTitle>
          <IonButtons slot="end">{renderPopover}</IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>{renderAdmin}</IonContent>
    </IonPage>
  )
}

export default memo(AdminPwas)
