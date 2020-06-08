import React, { memo, useMemo } from "react"
import { IonButton } from "@ionic/react"
import { BeforeInstallPromptEventType } from "../../hooks/useAddToHomescreenPrompt"

interface AddToHomeScreenProps {
  prompt: BeforeInstallPromptEventType
  promptToInstall: BeforeInstallPromptEventType
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  prompt,
  promptToInstall,
}) => {
  const handlePromptToInstall = () => {
    if (promptToInstall instanceof Function) {
      return promptToInstall()
    }
  }

  return useMemo(() => {
    return (
      <>
        {prompt && (
          <IonButton fill="clear" onClick={handlePromptToInstall}>
            Install
          </IonButton>
        )}
      </>
    )
  }, [prompt])
}

export default memo(AddToHomeScreen)
