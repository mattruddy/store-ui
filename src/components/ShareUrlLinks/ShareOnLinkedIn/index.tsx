import React, { memo } from "react"
import ShareUrlLink from ".."
import { IonIcon } from "@ionic/react"
import { logoLinkedin } from "ionicons/icons"

interface ContainerProps {
  url: string
}

const ShareOnLinkedIn: React.FC<ContainerProps> = ({
  url = window.location.href,
}) => (
  <ShareUrlLink
    color="linkedin"
    href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
  >
    <IonIcon size="small" icon={logoLinkedin} />
  </ShareUrlLink>
)

export default memo(ShareOnLinkedIn)
