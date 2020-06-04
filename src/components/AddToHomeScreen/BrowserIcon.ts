import React, { memo } from "react"
import { IonIcon } from "@ionic/react"

interface GetBrowserIconProps {
  isOnMobileBrowser: boolean
  browserUserAgent?: string
}

const BrowserIcon: React.FC<GetBrowserIconProps> = ({
  isOnMobileBrowser,
  browserUserAgent,
}) => {
  if (!browserUserAgent) return <div>No Browser Agent Detected</div>
  if (!isOnMobileBrowser) {
    if (browserUserAgent.includes("Chrome")) {
      return <IonIcon className="logo-chrome" />
    }
    if (browserUserAgent.includes("Firefox")) {
      return <IonIcon className="logo-firefox" />
    }
    // if (browserUserAgent.includes("Safari")) {
    //   return <IonIcon className="logo-chrome" />
    // }
    if (
      browserUserAgent.includes("Edge") ||
      browserUserAgent.includes("Explorer")
    ) {
      return <IonIcon className="logo-edge" />
    }
  } else {
    if (browserUserAgent.includes("Android")) {
      return <IonIcon className="logo-android" />
    }
    if (browserUserAgent.includes("iP")) {
      return <IonIcon className="logo-apple" />
    }
    if (browserUserAgent.includes("Windows")) {
      return <IonIcon className="logo-windows" />
    }
  }
  return <div>No Browser Detected</div>
}

export default memo(BrowserIcon)
