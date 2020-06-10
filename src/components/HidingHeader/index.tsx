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
  let [intialized, setIntialized] = useState<boolean>(false)
  const styles = useMemo(() => {
    if (!intialized) {
      if (header.current && header.current.clientHeight !== 0) {
        setIntialized(true)
      } else {
        return {}
      }
    } else {
      return {
        marginTop: `${-heightPrecentage * 100}px`,
        marginBottom: `${heightPrecentage * 100}px`,
      }
    }
  }, [heightPrecentage, intialized])

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
    [showHeader, children, styles]
  )
}

export default memo(HidingHeader)
