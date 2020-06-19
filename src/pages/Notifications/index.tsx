import { memo } from "react"
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react"
import React from "react"
import { StoreNotification } from "../../util/types"

const Notifications: React.FC = () => {
  const notifications: StoreNotification[] = [
    {
      body: "Td;alfkj;aslkdfj",
      subject: "Here is a test",
      timestamp: new Date(),
      id: 1,
    },
  ]

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {notifications.map((n, i) => (
            <IonLabel key={i}>
              <h2>{n.subject}</h2>
              <p>{n.body}</p>
            </IonLabel>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default memo(Notifications)
