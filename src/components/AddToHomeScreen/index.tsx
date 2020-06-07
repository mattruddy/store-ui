import React, { useState, useEffect, memo } from "react"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector } from "react-redux"
import { IonButton } from "@ionic/react"
import { BeforeInstallPromptEventType } from "../../hooks/useAddToHomescreenPrompt"
import AddToHomeScreenModal from "./AddToHomeScreenModal"

interface AddToHomeScreenProps {
  width?: string
  prompt: BeforeInstallPromptEventType
  promptToInstall: BeforeInstallPromptEventType
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
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

  const handlePromptToInstall = () => {
    if (!isInStandalone && !isDisabled && promptToInstall instanceof Function) {
      return promptToInstall()
    } else {
      return setIsOpen(true)
    }
  }

  const [isDisabled, setDisabledState] = useState(true)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const styles = { width }

  useEffect(() => {
    if (prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  const handleCloseModal = () => setIsOpen(false)

  return (
    <>
      <IonButton style={styles} fill="clear" onClick={handlePromptToInstall}>
        Install
      </IonButton>
      <AddToHomeScreenModal isOpen={isOpen} onClose={handleCloseModal} />
    </>
  )
}

export default memo(AddToHomeScreen)
