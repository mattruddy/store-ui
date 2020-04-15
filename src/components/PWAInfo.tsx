import React from 'react';
import { IonCard, IonCardContent, IonRippleEffect, IonButton } from '@ionic/react';
import { PWA } from '../util/types';
import { postScore } from '../data/dataApi';

interface ContainerProps {
    pwa: PWA,
    isLoading: boolean,
    appId: number,
}

const PWAInfo: React.FC<ContainerProps> = ({ pwa, isLoading, appId, }) => {
  return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center'}}>
                { pwa && 
                    <img style={{height: '80px', width: '80px', borderRadius: '5px', margin: '10px'}} src={pwa.icon} /> }
                { pwa && 
                    <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '70px'}}>
                        <p style={{ margin: '0', fontSize: '20px'}}>{pwa.name}</p>
                        <small>{pwa.category}</small>
                    </div>
                }
            </div>
            {pwa && <IonButton class='button' style={{ marginRight: '10px'}} onClick={() => {
            postScore(appId);
            window.open(pwa.link, "_blank");
            }}>Install</IonButton>}
        </div>
        { !isLoading && <h2 style={{paddingTop: '10px', paddingLeft: '10px'}}>About</h2> }
        <div style={{height: '200px', padding: '15px'}}>
            {pwa && pwa.description}
        </div> 
    </>
  );
};

export default PWAInfo;