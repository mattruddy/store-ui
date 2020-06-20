import { memo, useEffect, useCallback } from "react"
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonCard,
} from "@ionic/react"
import React from "react"
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { thunkSetLastNotId } from "../../redux/User/actions"
import NotifyList from "../../components/NotifyList"

const Notifications: React.FC = () => {
  const { notifications } = useSelector(
    ({ user: { notifications } }: ReduxCombinedState) => ({
      notifications,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const setLastNotId = useCallback(
    (id: number) => dispatch(thunkSetLastNotId(id)),
    [dispatch]
  )

  useEffect(() => {
    console.log(notifications)
    if (notifications.length > 0) {
      setLastNotId(notifications[0].id)
    }
  }, [notifications])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="line-around">
          <NotifyList notifications={notifications} />
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default memo(Notifications)
