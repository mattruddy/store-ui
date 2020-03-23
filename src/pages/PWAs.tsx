import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect } from '@ionic/react';
import PWACard from '../components/PWACard';
import './PWAs.css';
import CategoryOptions from '../components/CategoryOptions';
import { getPWAs } from '../data/dataApi';

const PWAs: React.FC = () => {

  const [cat, setCat] = useState<string>('');
  const [pwas, setPwas] = useState([]);

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
                pwas && pwas.map(({name, category, appId, icon}) => <PWACard category={category} name={name} icon={icon} appId={appId} />)
              }
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PWAs;
