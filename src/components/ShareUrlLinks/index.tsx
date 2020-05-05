import React, { memo } from "react"
import { IonFabButton } from "@ionic/react"

interface ContainerProps {
  children: any
  href: string
  target?: "_blank" | "_self" | "_parent" | "_top"
  color?: string
}

const ShareUrl: React.FC<ContainerProps> = ({
  children,
  target,
  href,
  color,
}) => (
  <IonFabButton
    color={color || "primary"}
    href={href}
    target={target || "_blank"}
  >
    {children}
  </IonFabButton>
)

export default memo(ShareUrl)
