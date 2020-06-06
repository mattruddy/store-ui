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
import { useHistory } from "react-router"
import { Axios } from "../../redux/Actions"

interface ContainerProps {
  pwa: PWA
  url: string
}

const PWACard: React.FC<ContainerProps> = ({ pwa, url }) => {
  const history = useHistory()
  const href = `${url}/${pwa.name.replace(/ /g, "-")}`

  const onPress = async () => {
    history.push(href)
    await (await Axios()).post(`public/pwa/view/${pwa.appId}`)
  }

  return (
    <IonCard className="PWACard fade-in" button onClick={onPress}>
      <IonCardHeader className="PWACardHeader PWACardContent">
        <IonImg alt="icon" className="PWACardImage" src={pwa.icon} />
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
      <IonRippleEffect />
    </IonCard>
  )
}

export default memo(PWACard)
