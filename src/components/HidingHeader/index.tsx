import { IonHeader, IonToolbar } from "@ionic/react"
import React, { memo, useMemo, useRef } from "react"

interface ContainerProps {
  children: any
  // number between 0 and 1
  hideDecimal: number
}

const HidingHeader: React.FC<ContainerProps> = ({ hideDecimal, children }) => {
  const header = useRef<any>(null)
  const styles = useMemo(
    () => ({
      marginTop: `${-hideDecimal * 100}px`,
      marginBottom: `${hideDecimal * 100}px`,
    }),
    [hideDecimal]
  )

  return useMemo(
    () => (
      <IonHeader
        ref={header}
        style={styles}
        className="ion-no-border bottom-line-border"
      >
        <IonToolbar>{children}</IonToolbar>
      </IonHeader>
    ),
    [children, styles]
  )
}

export default memo(HidingHeader)
