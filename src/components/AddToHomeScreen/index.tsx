import React, { memo, useMemo } from "react"
import { IonButton } from "@ionic/react"
import { BeforeInstallPromptEvent } from "../../hooks/useAddToHomescreenPromise/useAddToHomescreenPrompt"

interface AddToHomeScreenProps {
  prompt: BeforeInstallPromptEvent | undefined
  promptToInstall: () => Promise<void>
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({
  prompt,
  promptToInstall,
}) => {
  return useMemo(() => {
    return (
      <>
        {prompt && (
          <IonButton fill="outline" onClick={promptToInstall}>
            Install
          </IonButton>
        )}
      </>
    )
  }, [prompt])
}

export default memo(AddToHomeScreen)
