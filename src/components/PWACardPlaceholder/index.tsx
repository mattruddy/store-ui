import React, { memo } from "react"
import {
  IonCard,
  IonCardContent,
  IonRippleEffect,
  IonCardHeader,
  IonSkeletonText,
} from "@ionic/react"
import "./styles.css"

const PWACardPlaceholder: React.FC = () => {
  return (
    <IonCard className="PWACard fade-in">
      <IonCardHeader className="PWACardHeader PWACardContent">
        <IonSkeletonText animated className="SkeletonCardImage" />
      </IonCardHeader>
      <IonCardContent>
        <div className="PWACardContent">
          <IonSkeletonText
            animated
            className="PWACardTitle SkeletonCardTitle"
          />
        </div>

        <div className="PWACardContent">
          <IonSkeletonText
            animated
            className="PWACardSubTitle SkeletonCardSubTitle"
          />
        </div>

        <div className="PWACardContent">
          <IonSkeletonText animated className="SkeletonCardRating" />
        </div>
      </IonCardContent>
      <IonRippleEffect />
    </IonCard>
  )
}

export default memo(PWACardPlaceholder)
