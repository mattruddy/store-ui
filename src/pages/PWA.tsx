import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect, IonCard, IonCardHeader, IonCardContent, IonButton, IonImg, IonSlides, IonSlide, IonLabel } from '@ionic/react';
import { getPWA } from '../data/dataApi';
import { RouteComponentProps } from 'react-router';
import { PWA as PWAType } from '../util/types';

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

  useEffect(() => {
    loadPWA();
  }, [])

  const loadPWA = async () => {
    const resp = await getPWA(Number(match.params.id)) as PWAType;
    setPwa(resp);
  }

  return (
    <IonPage>
      <IonContent>
        <IonCardHeader>
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
        </IonCardHeader>
        <IonCardContent>
          <IonLabel>About</IonLabel>
          <div style={{height: '200px'}}>
          {pwa && pwa.description}
          </div> 
          <IonLabel>Screenshots</IonLabel>
          <IonSlides scrollbar={true}>
            <IonSlide>
              { pwa && <IonImg src={pwa!.screenshots[0].url} /> }
            </IonSlide>
            <IonSlide>
              { pwa && <IonImg src={pwa!.screenshots[0].url} /> }
            </IonSlide>
          </IonSlides>
        </IonCardContent>
      </IonContent>
    </IonPage>
  );
};

export default PWA;