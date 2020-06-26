import React, { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react"
import "./styles.css"
import { PWA } from "../../util/types"
import { GetPWADetailUrl } from "../../routes"

interface ContainerProps {
  app: PWA
}

const DevAppsCard: React.FC<ContainerProps> = ({ app }) => {
  return (
    <IonCard
      routerLink={`${GetPWADetailUrl(app.name)}`}
      className="bottom-line-border"
    >
      <IonCardHeader>
        <div className="DevAppHeader">
          <img className="DevAppIcon" height="60px" src={app.icon} />
          <div>
            <IonCardTitle> {app.name}</IonCardTitle>
            <IonCardSubtitle>{app.category}</IonCardSubtitle>
          </div>
        </div>
        <IonCardSubtitle></IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </IonCard>
  )
}

export default memo(DevAppsCard)
