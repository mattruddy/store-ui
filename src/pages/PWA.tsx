import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect, IonCard, IonCardHeader, IonCardContent, IonButton, IonImg, IonSlides, IonSlide, IonLabel, useIonViewDidEnter } from '@ionic/react';
import { getPWA } from '../data/dataApi';
import { RouteComponentProps } from 'react-router';
import { PWA as PWAType } from '../util/types';
import { pawSharp } from 'ionicons/icons';

interface MatchParams {
  id: string | undefined;
}

interface OwnProps extends RouteComponentProps<MatchParams> { };

interface StateProps {

};

interface DispatchProps {
}

type PWAProps = OwnProps & StateProps & DispatchProps;

const PWA: React.FC<PWAProps> = ({
  match
}) => {

  const [pwa, setPwa] = useState<PWAType | undefined>(undefined);

  useIonViewDidEnter(() => {
    loadPWA();
  }, [])

  const loadPWA = async () => {
    const resp = await getPWA(Number(match.params.id)) as PWAType;
    setPwa(resp);
  }

  return (
    <IonPage>
      <IonHeader>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              { pwa && 
                <IonImg style={{height: '70px', width: '70px'}} src={pwa.icon} /> }
              { pwa && 
                <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '70px'}}>
                  <p style={{ margin: '0', fontSize: '20px'}}>{pwa.name}</p>
                  <small>{pwa.category}</small>
                </div>}
            </div>
            {pwa && <IonButton>Install</IonButton>}
          </div>
      </IonHeader>
      <IonContent>
        <IonTitle style={{paddingTop: '10px'}}>About</IonTitle>
        <div style={{height: '200px', padding: '15px'}}>
        {pwa && pwa.description}
        </div> 
        <IonTitle>Screenshots</IonTitle>
        <IonSlides scrollbar={true}>
          {pwa && pwa.screenshots && pwa.screenshots.map((shot, idx) => (
            <IonSlide key={idx}>
              <IonImg style={{height: '400px', width: '200px'}} src={shot.url} /> 
            </IonSlide>
          ))}
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default PWA;