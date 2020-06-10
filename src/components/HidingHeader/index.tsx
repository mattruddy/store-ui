import { IonHeader, IonToolbar } from "@ionic/react"
import React, { memo, useMemo, useState, useRef } from "react"

interface ContainerProps {
  children: any
  showHeader: boolean
  // number between 0 and 1
  heightPrecentage: number
}

const HidingHeader: React.FC<ContainerProps> = ({
  showHeader,
  heightPrecentage,
  children,
}) => {
  const header = useRef<any>(null)
  const styles = useMemo(
    () => ({
      marginTop: `${-heightPrecentage * 100}px`,
      marginBottom: `${heightPrecentage * 100}px`,
    }),
    [heightPrecentage]
  )

  return useMemo(
    () => (
      <IonHeader
        ref={header}
        style={styles}
        className={`ion-no-border bottom-line-border ${
          !showHeader && "fade-out"
        }`}
      >
        <IonToolbar>{children}</IonToolbar>
      </IonHeader>
    ),
    [showHeader, children, heightPrecentage, styles]
  )
}

export default memo(HidingHeader)
