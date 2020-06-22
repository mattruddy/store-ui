import { memo, useEffect, useCallback } from "react"
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonButton,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react"
import React from "react"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import {
  thunkSetLastNotId,
  thunkLoadNotifications,
} from "../../redux/User/actions"
import NotifyList from "../../components/NotifyList"
import { refresh } from "ionicons/icons"
import ReactGA from "react-ga"

const Notifications: React.FC = () => {
  const { notifications, loading } = useSelector(
    ({ user: { notifications, notLoading } }: ReduxCombinedState) => ({
      notifications,
      loading: notLoading,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const setLastNotId = useCallback(
    (id: number) => dispatch(thunkSetLastNotId(id)),
    [dispatch]
  )
  const loadNotifications = useCallback(
    () => dispatch(thunkLoadNotifications()),
    [dispatch]
  )

  useEffect(() => {
    console.log(notifications)
    if (notifications.length > 0) {
      setLastNotId(notifications[0].id)
    }
  }, [notifications])

  useEffect(() => {
    ReactGA.pageview(`notifications`)
  }, [])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol>
            <IonButton fill="clear" onClick={loadNotifications}>
              <IonIcon icon={refresh} />
              Refresh
            </IonButton>
          </IonCol>
        </IonRow>
        <NotifyList loading={loading} notifications={notifications} />
      </IonContent>
    </IonPage>
  )
}

export default memo(Notifications)
