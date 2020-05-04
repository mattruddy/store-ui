import React, { memo } from "react"
import ShareUrl from ".."
import { IonIcon } from "@ionic/react"
import { logoTwitter } from "ionicons/icons"

interface ContainerProps {
  text: string
}

const ShareOnTwitter: React.FC<ContainerProps> = ({
  text = `Check my journal entry: ${window.location.href}`,
}) => (
  <ShareUrl href={`https://twitter.com/intent/tweet?text=${text}`}>
    <IonIcon icon={logoTwitter} />
  </ShareUrl>
)

export default memo(ShareOnTwitter)
