import React, { useState, useEffect, memo } from "react"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector } from "react-redux"
import { IonButton } from "@ionic/react"
import BrowserIcon from "./BrowserIcon"
import { BeforeInstallPromptEvent } from "./prompt"

interface AddToHomeScreenModalProps {
  width: string
  prompt: BeforeInstallPromptEvent
  promptToInstall: Event
}

const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({
  width = "auto",
  prompt,
  promptToInstall,
}) => {
  const { isInStandalone, isOnMobileBrowser, userAgent } = useSelector(
    ({
      window: {
        dimensions: {
          isInStandalone,
          isOnMobileBrowser,
          navigator: { userAgent },
        },
      },
    }: ReduxCombinedState) => ({
      isInStandalone,
      isOnMobileBrowser,
      userAgent,
    })
  )

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
      onClick={promptToInstall}
      disabled={isInStandalone || isDisabled}
    >
      <BrowserIcon
        isOnMobileBrowser={isOnMobileBrowser}
        userAgent={userAgent}
      />{" "}
      Install
    </IonButton>
  )
}

export default memo(AddToHomeScreenModal)
