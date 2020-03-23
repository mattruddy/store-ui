import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton, IonGrid, IonRow, IonImg } from '@ionic/react';
import './PWACard.css';

interface ContainerProps {
    name?: string,
    category?: string
    icon?: string
    appId?: number
}

const PWACard: React.FC<ContainerProps> = ({ name, icon, category, appId }) => {
  return (
    <IonCard button style={{ height: '200px', width: '200px'}} href={`/pwa/${appId}`}>
        <IonCardContent>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <IonImg style={{ height: '120px', width: '120px'}} src={icon} />
            </div>
        </IonCardContent>
        <div style={{paddingLeft: '10px'}}>
            <p style={{margin: '0', fontSize: '20px'}}>{name}</p>
            <small>{category}</small>
        </div>
    </IonCard>
  );
};

export default PWACard;