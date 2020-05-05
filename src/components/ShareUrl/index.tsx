import React, { useState, memo } from "react"
import { IonIcon, IonFab, IonFabButton, IonFabList } from "@ionic/react"
import { ShareOnFaceBook, ShareOnLinkedIn, ShareOnTwitter } from "../"
import { checkmark, clipboard, share } from "ionicons/icons"
import { copyStringToClipboard, shareUrl } from "../../util"

interface ContainerProps {
  title: string
}

const ShareUrl: React.FC<ContainerProps> = ({ title }) => {
  const [copiedUrlToClipboard, setCopiedUrlToClipboard] = useState(false)
  const { href } = window.location

  const url = href

  const text = "Check out this Progressive Web Application (PWA): "

  const twitterText = `${text}${url}`

  // @ts-ignore
  const canShareOnMobileDevice = navigator.share ? true : false

  const renderMainShareButtonIcon = copiedUrlToClipboard ? checkmark : share

  const renderSharButtonIcon = copiedUrlToClipboard
    ? checkmark
    : canShareOnMobileDevice
    ? share
    : clipboard

  const handleCopyUrlToClipboard = () => {
    setCopiedUrlToClipboard(true)
    copyStringToClipboard(url)
  }

  const handleShareOnMobile = () => {
    shareUrl(url, title, text)
  }

  const handleShareButtonClick = () => {
    if (canShareOnMobileDevice) {
      handleShareOnMobile()
    } else {
      handleCopyUrlToClipboard()
    }
  }

  return (
    <IonFab style={{ position: "relative" }}>
      <IonFabButton color="secondary" size="small">
        <IonIcon icon={renderMainShareButtonIcon} />
      </IonFabButton>
      <IonFabList side="end">
        <IonFabButton color="secondary" onClick={handleShareButtonClick}>
          <IonIcon icon={renderSharButtonIcon} />
        </IonFabButton>
        <ShareOnFaceBook url={url} />
        <ShareOnLinkedIn url={url} />
        <ShareOnTwitter text={twitterText} />
      </IonFabList>
    </IonFab>
  )
}

export default memo(ShareUrl)
