import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonSearchbar, IonPopover, IonButton, IonList, IonItem } from '@ionic/react';
import PWACard from '../components/PWACard';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs, getSearchApp } from '../data/dataApi';
import { PWA, Search } from '../util/types';

const PWAs: React.FC = () => {

  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState<PWA[]>([]);
  const [searchResults, setSearchResults] = useState<Search[]>([]);

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

  const onSearchChange = async (e: CustomEvent) => {
    const appName = e.detail.value.replace(/\s/g, '');
    if (appName) {
      const results = await getSearchApp(appName);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
            <IonTitle>PWA's</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar onIonChange={onSearchChange} />
        <IonList>
            { searchResults && searchResults.map((result, idx) => 
              <IonItem button href={`/pwa/${result.appId}`} key={idx}>
                {result.name}
              </IonItem>
            ) }
        </IonList>
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
