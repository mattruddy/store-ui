import React, { memo } from "react"
import ShareUrl from ".."
import { IonIcon } from "@ionic/react"
import { logoLinkedin } from "ionicons/icons"

interface ContainerProps {
  url: string
}

const ShareOnLinkedIn: React.FC<ContainerProps> = ({
  url = window.location.href,
}) => (
  <ShareUrl href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}>
    <IonIcon icon={logoLinkedin} />
  </ShareUrl>
)

export default memo(ShareOnLinkedIn)
