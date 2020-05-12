import React, { memo } from "react"
import {
  IonCard,
  IonCardContent,
  IonRippleEffect,
  IonImg,
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
  history: any
}

const PWACard: React.FC<ContainerProps> = ({ pwa, url, history }) => {
  const handleClick = () =>
    history.push(`${url}/${pwa.name.replace(/ /g, "-")}`)
  return (
    <IonCard className="fade-in box-shadow-hover" button onClick={handleClick}>
      <IonCardHeader>
        <IonCardTitle class="title">{pwa.name}</IonCardTitle>
        <IonCardSubtitle style={{ fontSize: "12px" }}>
          {pwa.category}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="content">
          <IonImg
            alt="icon"
            style={{ height: "100px", width: "100px", borderRadius: "5px" }}
            src={pwa.icon}
          />
        </div>
        <div className="card-footer">
          <StarRatings
            rating={pwa.averageRating}
            stars={5}
            starDimension="15px"
            starSpacing="2px"
          />
        </div>
      </IonCardContent>
      <IonRippleEffect />
    </IonCard>
  )
}

export default memo(PWACard)
