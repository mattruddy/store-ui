import React, { memo } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { PWA } from "../../util/types"
import "./styles.css"

interface ContainerProps {
  pwa: PWA
  url: string
}

const PWACard: React.FC<ContainerProps> = ({ pwa, url }) => {
  const href = `${url}/${pwa.name.replace(/ /g, "-")}`
  return (
    <IonCard className="PWACard fade-in" routerLink={href}>
      <IonCardHeader className="PWACardHeader PWACardContent">
        <img alt="icon" className="PWACardImage" src={pwa.icon} />
      </IonCardHeader>
      <IonCardContent>
        <div className="PWACardContent">
          <IonCardTitle className="PWACardTitle">{pwa.name}</IonCardTitle>
        </div>

        <div className="PWACardContent">
          <IonCardSubtitle className="PWACardSubTitle">
            {pwa.category}
          </IonCardSubtitle>
        </div>

        <div className="PWACardContent">
          <StarRatings
            rating={pwa.averageRating}
            stars={5}
            starDimension="15px"
            starSpacing="2px"
          />
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(PWACard)
