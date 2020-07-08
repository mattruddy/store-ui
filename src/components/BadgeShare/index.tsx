import React from "react"
import { IonCard, IonInput, IonIcon } from "@ionic/react"
import { copy } from "ionicons/icons"

interface ContainerProps {
  url: string
  name: string
}

const BadgeShare: React.FC<ContainerProps> = ({ url, name }) => {
  return (
    <IonCard className="line-around">
      <h3>Add your Progressive App Store Badge to your Readme!</h3>
      <span>
        <IonInput
          style={{ padding: "0px" }}
          className="line-around"
          value={`
          <img
        src="https://img.shields.io/static/v1?&message=ProgressiveApp.Store&color=74b9ff&style=flat&label=Discover%20at"
        href="${url}/${name.replace(/ /g, "-")}"
      />`}
        />
      </span>
      <span>
        <button
          style={{ background: "transparent", padding: "0px" }}
          className="sub-color"
        >
          <IonIcon icon={copy} size="small" />
        </button>
      </span>
      <img
        src={`https://img.shields.io/static/v1?&message=ProgressiveApp.Store&color=74b9ff&style=flat&label=Discover%20at`}
      />
    </IonCard>
  )
}
