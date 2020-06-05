import React, { useState, useEffect, memo } from "react"

import { IonModal, IonHeader, IonContent } from "@ionic/react"

interface AddToHomeScreenProps {
  isOpen: boolean
  onClose: () => void
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({ isOpen, onClose }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>How to install?</IonHeader>
      <IonContent>Video</IonContent>
    </IonModal>
  )
}

export default memo(AddToHomeScreen)
