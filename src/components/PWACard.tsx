import React from 'react';
import { IonCard, IonCardContent, IonRippleEffect } from '@ionic/react';
//@ts-ignore
import StarRatings from 'react-star-ratings';
import { PWA } from '../util/types';

interface ContainerProps {
    pwa: PWA
    url: string,
    history: any,
}

const PWACard: React.FC<ContainerProps> = ({ pwa, url, history }) => {
  return (
    <IonCard button style={{ height: '330px', width: '330px'}} onClick={() => history.push(`${url}/${pwa.appId}`)}>
        <IonCardContent style={{overflow: 'hidden'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <img style={{ height: '200px', width: '200px', borderRadius: '5px'}} src={pwa.icon} />
            </div>
        <div style={{paddingLeft: '10px'}}>
            <p style={{margin: '0', fontSize: '20px'}}>{pwa.name}</p>
            <small>{pwa.category}</small>
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: '50px'
        }}>
            <StarRatings 
                rating={pwa.averageRating} 
                stars={5}
                starDimension="20px"
                starSpacing="4px" 
            />
        </div>
        </IonCardContent>
        <IonRippleEffect />
    </IonCard>
  );
};

export default PWACard;