import React, { useState, useCallback, memo } from "react"
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
  text: string
}

const ShareUrl: React.FC<ContainerProps> = ({
  title,
  text = "Check out this Progressive Web Application (PWA): ",
}) => {
  const [copiedUrlToClipboard, setCopiedUrlToClipboard] = useState(false)
  const { href } = window.location

  const url = href

  // @ts-ignore
  const canShareOnMobileDevice = navigator.share ? true : false

  const renderSharButtonIcon = copiedUrlToClipboard
    ? checkmark
    : canShareOnMobileDevice
    ? share
    : clipboard

  const renderShareButtonText = copiedUrlToClipboard
    ? "Copied"
    : "Copy  "

  const handleCopyUrlToClipboard = () => {
    setCopiedUrlToClipboard(true)
    copyStringToClipboard(url)
  }

  const handleShareOnMobile = useCallback(() => {
    shareUrl(url, title, text)
  }, [url])

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
        <IonCol>
          <IonButton className="ShareButton" onClick={handleShareButtonClick}>
            <IonIcon icon={renderSharButtonIcon} />
            <IonText>{renderShareButtonText}</IonText>
          </IonButton>
        </IonCol>
        <IonCol>
          <ShareOnFaceBook url={url} />
        </IonCol>
        <IonCol>
          <ShareOnLinkedIn url={url} />
        </IonCol>
        <IonCol>
          <ShareOnTwitter text={text} />
        </IonCol>
      </IonRow>
      <IonItemDivider />
    </IonGrid>
  )
}

export default memo(ShareUrl)
