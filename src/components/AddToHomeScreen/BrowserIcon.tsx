import React, { memo } from "react"
import { IonIcon } from "@ionic/react"
import {
  logoChrome,
  logoFirefox,
  logoEdge,
  logoAndroid,
  logoApple,
  logoWindows,
} from "ionicons/icons"

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
      return <IonIcon icon={logoChrome} />
    }
    if (browserUserAgent.includes("Firefox")) {
      return <IonIcon icon={logoFirefox} />
    }
    // if (browserUserAgent.includes("Safari")) {
    //   return <IonIcon className="logo-chrome" />
    // }
    if (
      browserUserAgent.includes("Edge") ||
      browserUserAgent.includes("Explorer")
    ) {
      return <IonIcon icon={logoEdge} />
    }
  } else {
    if (browserUserAgent.includes("Android")) {
      return <IonIcon icon={logoAndroid} />
    }
    if (browserUserAgent.includes("iP")) {
      return <IonIcon icon={logoApple} />
    }
    if (browserUserAgent.includes("Windows")) {
      return <IonIcon className={logoWindows} />
    }
  }
  return <div>No Browser Detected</div>
}

export default memo(BrowserIcon)
