import React, { useState, memo } from "react"
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonItemDivider,
  IonText,
} from "@ionic/react"
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

  const renderSharButtonIcon = copiedUrlToClipboard
    ? checkmark
    : canShareOnMobileDevice
    ? share
    : clipboard

  const renderShareButtonText = copiedUrlToClipboard ? "Copied" : "Copy  "

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
    <IonGrid>
      <IonRow>
        <IonCol sizeXs="6" sizeSm="3">
          <IonButton className="ShareButton" onClick={handleShareButtonClick}>
            <IonIcon icon={renderSharButtonIcon} />
            <IonText>{renderShareButtonText}</IonText>
          </IonButton>
        </IonCol>
        <IonCol sizeXs="2" sizeSm="3">
          <ShareOnFaceBook url={url} />
        </IonCol>
        <IonCol sizeXs="2" sizeSm="3">
          <ShareOnLinkedIn url={url} />
        </IonCol>
        <IonCol sizeXs="2" sizeSm="3">
          <ShareOnTwitter text={twitterText} />
        </IonCol>
      </IonRow>
      <IonItemDivider />
    </IonGrid>
  )
}

export default memo(ShareUrl)
