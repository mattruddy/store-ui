import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import PWACard from '../components/PWACard';
import './PWAs.css';

const PWAs: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'space-between'}}>
            <IonTitle>PWA's</IonTitle>
            <IonSelect placeholder="Category">
              <IonSelectOption>
                Gaming
              </IonSelectOption>
            </IonSelect>
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
          <IonGrid>
            <IonRow>
              <PWACard category="Gaming" name="Test" />
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default PWAs;
