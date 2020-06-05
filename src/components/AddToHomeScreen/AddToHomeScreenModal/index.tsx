import React, { useState, useEffect, memo } from "react"

import { IonModal } from "@ionic/react"

interface AddToHomeScreenProps {
  isOpen: boolean
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({ isOpen }) => {

  return <IonModal></IonModal>
}

export default memo(AddToHomeScreen)
