import { memo } from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonIcon,
} from "@ionic/react"
import React from "react"
import {
  closeCircleOutline,
  addCircleOutline,
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons"

interface ContainerProps {
  title: string
  onClick: () => void
  isHidden: boolean
  children: any
}

const DevContentCard: React.FC<ContainerProps> = ({
  title,
  onClick,
  isHidden,
  children,
}) => {
  return (
    <IonCard className="line-around">
      <IonCardHeader onClick={onClick} className="bottom-line-border clickable">
        <IonCardTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IonIcon
              style={{ paddingRight: "8px" }}
              icon={!isHidden ? chevronDownOutline : chevronUpOutline}
            />
            <span>{title}</span>
          </div>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className={isHidden ? "hide" : ""}>
        {children}
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DevContentCard)
