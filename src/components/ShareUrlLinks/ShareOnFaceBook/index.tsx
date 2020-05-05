import React, { memo } from "react"
import ShareUrlLink from ".."
import { IonIcon } from "@ionic/react"
import { logoFacebook } from "ionicons/icons"

interface ContainerProps {
  url: string
}

const ShareOnFacebook: React.FC<ContainerProps> = ({
  url = window.location.href,
}) => (
  <ShareUrlLink href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}>
    <IonIcon icon={logoFacebook} />
  </ShareUrlLink>
)

export default memo(ShareOnFacebook)
