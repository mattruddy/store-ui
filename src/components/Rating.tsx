import React, { useState } from 'react';
//@ts-ignore
import StarRatings from 'react-star-ratings';
import Collapsible from 'react-collapsible';
import { IonTextarea, IonButton, IonText } from '@ionic/react';

interface ContainerProps {
    onSubmit: (star: number, comment: string) => {}
}

const Rating: React.FC<ContainerProps> = ({ onSubmit }) => {
    const [star, setStar] = useState<number>(0);
    const [starError, setStarError] = useState<string | undefined>();
    const [comment, setComment] = useState<string>();
    const [commentError, setCommentError] = useState<string | undefined>();

    const handleSubmit = () => {
        if (star < 1 || star > 5) {
            setStarError('Must be between 1 and 5 stars');
            return;
        }
    
        if (!comment) {
            setCommentError('Comment is required');
            return;
        }
        onSubmit(star, comment);
        setComment('');
        setStar(0);
    }

  return (
      <Collapsible
        trigger="Click to Add a Review"
        triggerStyle={{
            display: 'flex',
            justifyContent: 'center',
            height: '30px',
            cursor: 'pointer',
        }}
        triggerWhenOpen="Close"
        transitionTime={200}
      >
        <StarRatings 
            rating={star}
            changeRating={(newRating: number) => {
                setStarError(undefined);
                setStar(newRating);
            }}
            stars={5} 
            starRatedColor="rgb(109, 122, 130)"
            starHoverColor="rgb(109, 122, 130)"
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
        <IonButton expand="block" onClick={handleSubmit}>Add</IonButton>
      </Collapsible>
  );
};

export default Rating;