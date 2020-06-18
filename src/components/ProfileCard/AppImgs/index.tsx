import React, { memo } from "react"
import { IonRouterLink } from "@ionic/react"
import "./styles.css"
import { PWA } from "../../../util/types"

interface ContainerProps {
  pwas: PWA[]
}

const AppImgs: React.FC<ContainerProps> = ({ pwas }) => {
  return (
    <div className="ProfileAppsContainer">
      <div className="ProfileAppsRow">
        {pwas.map((pwa, idx) => (
          <IonRouterLink
            key={idx}
            routerLink={`/pwa/${pwa.name.replace(/ /g, "-")}`}
          >
            <img alt="icon" src={pwa.icon} height="35" width="35" />
          </IonRouterLink>
        ))}
      </div>
    </div>
  )
}

export default memo(AppImgs)
