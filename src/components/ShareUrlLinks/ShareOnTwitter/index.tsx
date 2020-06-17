import React, { memo } from "react"
import ShareUrlLink from ".."
import { IonIcon } from "@ionic/react"
import { logoTwitter } from "ionicons/icons"

interface ContainerProps {
  text: string
}

const ShareOnTwitter: React.FC<ContainerProps> = ({
  text = `Check my journal entry: ${window.location.href}`,
}) => (
  <ShareUrlLink
    color="twitter"
    href={`https://twitter.com/intent/tweet?text=${text}`}
  >
    <IonIcon size="small" icon={logoTwitter} />
  </ShareUrlLink>
)

export default memo(ShareOnTwitter)
