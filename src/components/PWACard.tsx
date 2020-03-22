import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonGrid, IonRow, IonImg } from '@ionic/react';
import './PWACard.css';

interface ContainerProps {
    name?: string,
    category?: string
    icon?: string
}

const PWACard: React.FC<ContainerProps> = ({ name, icon, category }) => {
  return (
    <IonCard button style={{ height: '200px', width: '200px'}}>
        <IonCardHeader>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <p>{name}</p>
                <p>{category}</p>
            </div>
        </IonCardHeader>
        <IonCardContent>
            <IonImg src='https://shortss.s3.amazonaws.com/shorts-180.png' />
        </IonCardContent>
    </IonCard>
  );
};

export default PWACard;