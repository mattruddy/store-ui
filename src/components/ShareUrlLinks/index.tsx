import React, { memo } from "react"
import { IonFabButton } from "@ionic/react"

interface ContainerProps {
  children: any
  href: string
  target?: "_blank" | "_self" | "_parent" | "_top"
}

const ShareUrl: React.FC<ContainerProps> = ({ children, target, href }) => (
  <IonFabButton color="secondary" href={href} target={target || "_blank"}>
    {children}
  </IonFabButton>
)

export default memo(ShareUrl)
