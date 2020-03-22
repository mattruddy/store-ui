import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel } from '@ionic/react';

const Profile: React.FC = () => {
  return (
    <IonPage>
          <IonItem button routerLink="/logout" routerDirection="none">
            <IonLabel>Logout</IonLabel>
          </IonItem>
    </IonPage>
  );
};

export default Profile;