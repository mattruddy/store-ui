import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonSearchbar } from '@ionic/react';
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
            <IonTitle>PWA's</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar />
        <CategoryOptions onPress={onPress} />
          <IonGrid >
            <IonRow>
              {
                pwas.map((pwa, idx) => {
                  if (pwa) {
                    return <PWACard key={idx} category={pwa.category} name={pwa.name} icon={pwa.icon} appId={pwa.appId} />
                  }
                } )
              }
            </IonRow>
          </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PWAs;
