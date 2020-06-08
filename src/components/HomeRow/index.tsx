import React, { memo, Fragment } from "react"
import { IonButton, IonRow, IonCol, IonIcon } from "@ionic/react"
import { PWA } from "../../util/types"
import PWACardPlaceholder from "../PWACardPlaceholder"
import { PWACard } from ".."
import { arrowForward } from "ionicons/icons"
import "./styles.css"

interface ContainerProps {
  pwas: PWA[]
  linkTo: string
  isLoading: boolean
  title: string
  onPressCallback: (value: string) => void
}

const HomeRow: React.FC<ContainerProps> = ({
  pwas,
  linkTo,
  isLoading,
  title,
  onPressCallback,
}) => {
  return (
    <Fragment>
      <div className="HomeRowHeader">
        <h1 className="HomeRowHeaderTitle">{title}</h1>
        <IonButton
          className="HomeViewMoreButton"
          onClick={() => onPressCallback(linkTo)}
        >
          <IonIcon color="dark" icon={arrowForward} />
        </IonButton>
      </div>
      <IonRow className="HomeRow bottom-line-border">
        {isLoading
          ? [...Array(5)].map((_e, i) => (
              <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                <PWACardPlaceholder />
              </IonCol>
            ))
          : pwas.map((topApp, i) => (
              <IonCol key={i} sizeXs="6.7" sizeSm="4" sizeMd="5" sizeLg="4">
                <PWACard url="/pwa" pwa={topApp} />
              </IonCol>
            ))}
      </IonRow>
    </Fragment>
  )
}

export default memo(HomeRow)
