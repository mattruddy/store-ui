import React, { useEffect } from 'react';
import { IonList, IonItem, IonLabel, IonRadioGroup, IonTitle, IonListHeader, IonRadio, IonToggle, IonIcon } from '@ionic/react';
import { checkmarkDone, checkbox } from 'ionicons/icons';


interface LighthouseProps {
  installable: boolean,
  iosIcon: boolean,
}

const Lighthouse: React.FC<LighthouseProps> = ({
  installable,
  iosIcon,
}) => {

  return (
    <>
    {
      <>
        <IonList>
            <IonListHeader>
              <IonTitle>
                Lighthouse PWA Report
              </IonTitle>
            </IonListHeader>
            <IonItem>

              <IonLabel>Installable</IonLabel>
              {
                <IonIcon slot="end" icon={installable?checkmarkDone:checkbox} />
              }
            </IonItem>
            <IonItem>
              <IonLabel>Valid iOS Icon</IonLabel>
              {
                <IonIcon slot="end" icon={iosIcon?checkmarkDone:checkbox} />
              }
            </IonItem>
        </IonList>
      </>
    }
    </>
  );
}

export default Lighthouse;