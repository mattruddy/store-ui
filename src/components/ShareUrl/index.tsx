import React, { useState, memo, Fragment } from "react"
import { IonIcon, IonFabButton } from "@ionic/react"
import { ShareOnFaceBook, ShareOnLinkedIn, ShareOnTwitter } from "../"
import { checkmark, clipboard, share, shareSocialOutline } from "ionicons/icons"
import { copyStringToClipboard, shareUrl } from "../../util"

const RESET_COPY_URL_INTERVAL = 5 * 1000

interface ContainerProps {
  title: string
  url: string
}

const ShareUrl: React.FC<ContainerProps> = ({ title, url }) => {
  const [copiedUrlToClipboard, setCopiedUrlToClipboard] = useState(false)

  const text = `Check out ${title} on Progressive App Store: `

  const twitterText = `${text}${url}`

  // @ts-ignore
  const canShareOnMobileDevice = navigator.share ? true : false

  const renderShareButtonIcon = copiedUrlToClipboard
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
        <IonIcon size="small" icon={renderShareButtonIcon} />
      </IonFabButton>
      <ShareOnFaceBook url={url} />
      <ShareOnLinkedIn url={url} />
      <ShareOnTwitter text={twitterText} />
    </Fragment>
  )
}

export default memo(ShareUrl)
