import { memo } from "react"
import { PublicProfile } from "../../util/types"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react"
import React from "react"

interface ContainerProps {
  dev: PublicProfile
  url: string
}

const DevCard: React.FC<ContainerProps> = ({ dev, url }) => {
  const href = `/dev/${dev.username}`
  return (
    <IonCard className="fade-in" routerLink={href}>
      <IonCardHeader className="PWACardHeader PWACardContent">
        <img
          alt="icon"
          className="ProfileCardImg icon line-around"
          src={dev.avatar ? dev.avatar : "assets/icon/apple-touch-icon.png"}
        />
      </IonCardHeader>
      <IonCardContent>
        <div className="PWACardContent">
          <IonCardTitle className="PWACardTitle">
            {dev.fullName ? dev.fullName : dev.username}
          </IonCardTitle>
        </div>

        <div className="PWACardContent">
          <IonCardSubtitle className="PWACardSubTitle">
            {dev.fullName ? dev.username : ""}
          </IonCardSubtitle>
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DevCard)
