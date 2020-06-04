import React, { useState, useEffect, memo } from "react"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector } from "react-redux"
import { IonButton } from "@ionic/react"
import BrowserIcon from "./BrowserIcon"
import { BeforeInstallPromptEventType } from "../../hooks/useAddToHomescreenPrompt"

interface AddToHomeScreenModalProps {
  width?: string
  prompt: BeforeInstallPromptEventType
  promptToInstall: BeforeInstallPromptEventType
}

const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({
  width = "auto",
  prompt,
  promptToInstall,
}) => {
  const { isInStandalone, isOnMobileBrowser, userAgent } = useSelector(
    ({
      window: {
        isInStandalone,
        isOnMobileBrowser,
        navigator: { userAgent },
      },
    }: ReduxCombinedState) => ({
      isInStandalone,
      isOnMobileBrowser,
      userAgent,
    })
  )

  const handlePromptToInstall = () => promptToInstall

  const [isDisabled, setDisabledState] = useState(true)

  const styles = { width }

  useEffect(() => {
    if (prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  return (
    <IonButton
      style={styles}
      color="success"
      onClick={handlePromptToInstall}
      disabled={isInStandalone || isDisabled}
    >
      <BrowserIcon
        isOnMobileBrowser={isOnMobileBrowser}
        browserUserAgent={userAgent}
      />{" "}
      Install
    </IonButton>
  )
}

export default memo(AddToHomeScreenModal)
