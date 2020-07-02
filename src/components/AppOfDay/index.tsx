import {
  IonCard,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react"
import React, { memo } from "react"

interface AppOfDayProps {
  url: string
  icon: string
  info: string
  title: string
}

const AppOfDay: React.FC<AppOfDayProps> = ({ url, icon, info, title }) => {
  return (
    <IonCard button routerLink={url} className="line-around">
      <IonRow>
        <IonCol size="3">
          <img src={icon} style={{ padding: "16px", width: "75%" }} />
        </IonCol>
        <IonCol size="9">
          <IonCardTitle style={{ padding: "16px" }}>{title}</IonCardTitle>
          <IonCardSubtitle style={{ padding: "16px" }}>{info}</IonCardSubtitle>
        </IonCol>
      </IonRow>
    </IonCard>
  )
}

export default memo(AppOfDay)
