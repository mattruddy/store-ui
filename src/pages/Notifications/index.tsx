import React, { useState, memo, useCallback, useEffect, useMemo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonButton,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonRow,
  IonCol,
} from "@ionic/react"
import { RouteMap } from "../../routes"
import { validEmail } from "../../util/index"
import { useHistory } from "react-router"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { setNotifications } from "../../redux/User/actions"
import { FormItem } from "../../components"
import { StoreNotification } from "../../util/types"
import { radioButtonOn, radioButtonOff, filter, map } from "ionicons/icons"

const Notifications: React.FC = () => {
  const history = useHistory()
  const [notifications, setNotifications] = useState<StoreNotification[]>([
    {
      id: 1,
      isRead: false,
      isArchived: false,
      body: "hey, testing\nand some more",
      subject: "this is a test",
    },
    {
      id: 2,
      isRead: false,
      isArchived: false,
      body: "hey, testing\nand some more",
      subject: "this is a test",
    },
    {
      id: 3,
      isRead: false,
      isArchived: false,
      subject: "this is a test",
    },
  ])

  // const { notifications } = useSelector(
  //   ({ user: { notifications } }: ReduxCombinedState) => ({
  //     notifications,
  //   }),
  //   shallowEqual
  // )

  // const dispatch = useDispatch()
  // const setNotications = useCallback(
  //   (notifications: StoreNotification[]) =>
  //     dispatch(setNotifications(notifications)),
  //   [dispatch]
  // )

  const renderNotificationsList = useMemo(
    () => (
      <IonList lines="full">
        {notifications.map((n) => (
          <IonItem
            button
            onClick={() => {
              setNotifications((notifications) =>
                [
                  ...notifications.filter((x) => x !== n),
                  { ...n, isRead: true },
                ].sort((a, b) => a.id - b.id)
              )
              console.log(notifications)
            }}
          >
            <IonIcon
              slot="start"
              icon={n.isRead ? radioButtonOff : radioButtonOn}
            />
            <IonLabel>
              <h1>{n.subject}</h1>
              <p>{n.body}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    ),
    [notifications]
  )

  const markAllRead = () => {
    setNotifications((n) =>
      n.map((note) => ({ ...note, isRead: true } as StoreNotification))
    )
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        <IonRow>
          <IonCol>
            <IonButton onClick={markAllRead}>Mark All as Read</IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderNotificationsList}</IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  )
}

export default memo(Notifications)