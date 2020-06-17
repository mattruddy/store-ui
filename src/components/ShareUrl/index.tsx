import React, { useEffect, useState, memo, Fragment } from "react"
import {
  IonIcon,
  IonFabButton,
} from "@ionic/react"
import { ShareOnFaceBook, ShareOnLinkedIn, ShareOnTwitter } from "../"
import { checkmark, clipboard, share, shareSocialOutline } from "ionicons/icons"
import { copyStringToClipboard, shareUrl } from "../../util"

const RESET_COPY_URL_INTERVAL = 5 * 1000

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

  const handleCopyUrlToClipboard = () => {
    setCopiedUrlToClipboard(true)
    copyStringToClipboard(url)
    setTimeout(() => setCopiedUrlToClipboard(false), RESET_COPY_URL_INTERVAL)
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
    <Fragment>
      <IonFabButton
        className="fab-no-shadow"
        color="secondary"
        onClick={handleShareButtonClick}
        size="small"
      >
        <IonIcon size="small" icon={renderSharButtonIcon} />
      </IonFabButton>
      <ShareOnFaceBook url={url} />
      <ShareOnLinkedIn url={url} />
      <ShareOnTwitter text={twitterText} />
    </Fragment>
  )
}

export default memo(ShareUrl)
