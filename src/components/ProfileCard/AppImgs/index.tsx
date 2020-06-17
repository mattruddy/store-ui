import React, { memo } from "react"
import { IonRouterLink } from "@ionic/react"
import "./styles.css"
import { PWA } from "../../../util/types"

interface ContainerProps {
  pwas: PWA[]
}

const AppImgs: React.FC<ContainerProps> = ({ pwas }) => {
  return (
    <div className="ProfileAppsRow">
      {pwas.map((pwa, idx) => (
        <IonRouterLink
          key={idx}
          style={{ padding: "8px" }}
          routerLink={`/pwa/${pwa.name.replace(/ /g, "-")}`}
        >
          <img
            alt="icon"
            style={{ padding: "8px" }}
            src={pwa.icon}
            height="50"
            width="50"
          />
        </IonRouterLink>
      ))}
    </div>
  )
}

export default memo(AppImgs)
