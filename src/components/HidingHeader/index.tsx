import { IonHeader, IonToolbar } from "@ionic/react"
import React, { memo, useEffect, useMemo, useState } from "react"

interface ContainerProps {
  children: any
  scrollYDelta: number
}

const HidingHeader: React.FC<ContainerProps> = ({ scrollYDelta, children }) => {
  const [showHeader, setShowHeader] = useState<boolean>(true)

  useEffect(() => {
    const show = scrollYDelta < 3 ? true : false
    show != showHeader && setShowHeader(show)
  }, [scrollYDelta])

  return useMemo(
    () => (
      <IonHeader
        className={`ion-no-border bottom-line-border ${
          showHeader ? "fade-in" : "fade-out"
        }`}
      >
        <IonToolbar>{children}</IonToolbar>
      </IonHeader>
    ),
    [showHeader, children]
  )
}

export default memo(HidingHeader)
