import React, { useState } from 'react';
//@ts-ignore
import StarRatings from 'react-star-ratings';
import Collapsible from 'react-collapsible';
import { IonTextarea, IonButton, IonText } from '@ionic/react';
import { postRating } from '../data/dataApi';

const stars = [
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE"
]

interface ContainerProps {
    appId: number;
}

const Rating: React.FC<ContainerProps> = ({ appId }) => {
    const [star, setStar] = useState<number>(0);
    const [starError, setStarError] = useState<string | undefined>();
    const [comment, setComment] = useState<string>();
    const [commentError, setCommentError] = useState<string | undefined>();

    const onRatingSubmit = async () => {
        if (star < 1 || star > 5) {
            setStarError('Must be between 1 and 5 stars');
            return;
        }

        if (!comment) {
            setCommentError('Comment is required');
            return;
        }
        const starVal = stars[star - 1];
        const response = await postRating(starVal, appId, comment);
        console.log(response);
    }
  return (
      <Collapsible trigger="Add a Rating">
        <StarRatings 
            rating={star}
            changeRating={(newRating: number) => {
                setStarError(undefined);
                setStar(newRating);
            }}
            stars={5} 
            starRatedColor="blue"
            starHoverColor="blue"
            name="rating"
        />
        {starError && <IonText color="danger"><p>{starError}</p></IonText>}
        <IonTextarea
            placeholder="Add a comment"
            value={comment}
            onIonChange={(e) => {
                setCommentError(undefined);
                setComment(e.detail.value!)
            }}
            rows={7}
            maxlength={1500}
        />
        {commentError && <IonText color="danger"><p>{commentError}</p></IonText>}
        <IonButton onClick={onRatingSubmit}>Add</IonButton>
      </Collapsible>
  );
};

export default Rating;