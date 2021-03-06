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
  chevronDownOutline,
  chevronUpOutline,
} from "ionicons/icons"

interface ContainerProps {
  title?: string
  icon?: string
  count?: number
  onClick: () => void
  isHidden: boolean
  children: any
}

const DevContentCard: React.FC<ContainerProps> = ({
  title,
  icon,
  count,
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
            <span>
              {icon ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IonIcon style={{ paddingRight: "8px" }} icon={icon} />
                  <span>{count}</span>
                </div>
              ) : (
                title
              )}
            </span>
          </div>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className={`${isHidden ? "hide" : ""} no-padding`}>
        {children}
      </IonCardContent>
    </IonCard>
  )
}

export default memo(DevContentCard)
