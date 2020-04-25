import React from 'react';
import { IonSlides, IonSlide } from '@ionic/react';
import { Image } from '../util/types';
import './ScreenshotSlider.css';

interface ContainerProps {
    screenshots: Image[]
}

const ScreenshotSlider: React.FC<ContainerProps> = ({ screenshots }) => {
  return (
    <IonSlides 
      className="slider"
      key={screenshots.map((shot) => shot.imageId).join('_')} 
      pager={true}
      options={{ 
        initialSlide: 0, 
        speed: 400,
      }}
    >
        {screenshots.map((shot, idx) => (
        <IonSlide style={{height: '500px'}} key={idx}>
            <img style={{height: '400px'}} src={shot.url} /> 
        </IonSlide>
        ))}
    </IonSlides>  
  );
};

export default ScreenshotSlider;