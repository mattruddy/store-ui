import React, { memo } from "react"
import {
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonIcon,
} from "@ionic/react"
import { checkmark, close } from "ionicons/icons"

interface LighthouseProps {
  installable: boolean
  iosIcon: boolean
  runsOffline: boolean
}

const Lighthouse: React.FC<LighthouseProps> = ({
  installable,
  iosIcon,
  runsOffline,
}) => {
  return (
    <>
      {
        <>
          <IonList>
            <IonListHeader>
              <IonLabel>Lighthouse PWA Report</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Installable</IonLabel>
              {<IonIcon slot="end" icon={installable ? checkmark : close} />}
            </IonItem>
            <IonItem>
              <IonLabel>Valid iOS Icon</IonLabel>
              {<IonIcon slot="end" icon={iosIcon ? checkmark : close} />}
            </IonItem>
            <IonItem>
              <IonLabel>Runs Offline</IonLabel>
              {<IonIcon slot="end" icon={runsOffline ? checkmark : close} />}
            </IonItem>
          </IonList>
        </>
      }
    </>
  )
}

export default memo(Lighthouse)
