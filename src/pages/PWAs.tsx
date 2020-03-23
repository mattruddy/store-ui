import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect } from '@ionic/react';
import PWACard from '../components/PWACard';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs } from '../data/dataApi';
import { PWA } from '../util/types';

const PWAs: React.FC = () => {

  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState<PWA[]>([]);

  useEffect(() => {
    loadPWAs();
  }, [])

  const loadPWAs = async () => {
    const resp = await getPWAs();
    setPwas(prev => prev.concat(resp));
  }

  const onPress = (option: string) => {
    setCat(option);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <IonTitle>PWA's</IonTitle>
            <CategoryOptions onPress={onPress} />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">PWA's</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid >
            <IonRow>
              {
                pwas.map((pwa) => {
                  if (pwa) {
                    return <PWACard category={pwa.category} name={pwa.name} icon={pwa.icon} appId={pwa.appId} />
                  }
                } )
              }
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PWAs;
