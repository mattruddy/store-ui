import React, { memo } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react"
import { PWA } from "../../util/types"
import "./styles.css"
import { Axios } from "../../redux/Actions"
import { peopleOutline } from "ionicons/icons"

interface ContainerProps {
  pwa: PWA
  url: string
  isMyPwa: boolean
  height?: number
}

const PWACard: React.FC<ContainerProps> = ({
  pwa,
  url,
  isMyPwa,
  height = 90,
}) => {
  const href = `${url}/${pwa.name.replace(/ /g, "-")}`

  const sendPageView = async () =>
    !isMyPwa && (await (await Axios()).post(`public/pwa/view/${pwa.appId}`))

  return (
    <IonCard
      className="PWACard fade-in"
      routerLink={href}
      onClick={sendPageView}
    >
      <IonCardHeader className="PWACardHeader PWACardContent">
        <img
          height={height}
          width={height}
          alt="icon"
          className="PWACardImage"
          src={pwa.icon}
        />
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
          <>
            <IonIcon className="PWACardStar" icon={peopleOutline} />
            <span>{pwa.ratingsCount}</span>
          </>
        </div>
      </IonCardContent>
    </IonCard>
  )
}

export default memo(PWACard)
