import React, { useState } from 'react';
//@ts-ignore
import StarRatings from 'react-star-ratings';
import { Rating } from '../util/types';
import { IonItem } from '@ionic/react';

interface ContainerProps {
    rating: Rating
}

const RatingList: React.FC<ContainerProps> = ({rating}) => {
  return (
      <IonItem>
          <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
            <StarRatings 
                rating={rating.star} 
                starDimension="20px"
                starSpacing="2px"
            />
            <div>
              <p>{rating.comment}</p>
            </div>
            <div style={{
              fontSize: "15px"
            }}>
              {rating.from}
            </div>
          </div>
      </IonItem>
  );
};

export default RatingList;