import React, { useState, memo } from "react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import Collapsible from "react-collapsible"
import { IonTextarea, IonButton, IonText, IonToast } from "@ionic/react"

interface ContainerProps {
  onSubmit: (star: number, comment?: string) => {}
}

const Rating: React.FC<ContainerProps> = ({ onSubmit }) => {
  const [star, setStar] = useState<number>(0)
  const [starError, setStarError] = useState<string | undefined>()
  const [comment, setComment] = useState<string | undefined>()
  const [commentError, setCommentError] = useState<string | undefined>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | undefined>()

  const handleSubmit = () => {
    try {
      setIsSubmit(true)
      if (star < 1 || star > 5) {
        setStarError("Must be between 1 and 5 stars")
        return
      }

      onSubmit(star, comment)
      setToastMessage("Success")
      setShowToast(true)
      setComment("")
      setStar(0)
    } finally {
      setIsSubmit(false)
    }
  }

  return (
    <>
      <Collapsible
        trigger="Click to Add a Review"
        triggerStyle={{
          display: "flex",
          justifyContent: "center",
          height: "30px",
          cursor: "pointer",
        }}
        triggerWhenOpen="Close"
        transitionTime={200}
      >
        <div style={{ padding: "15px" }}>
          <StarRatings
            rating={star}
            changeRating={(newRating: number) => {
              setStarError(undefined)
              setStar(newRating)
            }}
            stars={5}
            starRatedColor="rgb(109, 122, 130)"
            starHoverColor="rgb(109, 122, 130)"
            name="rating"
            starDimension="30px"
            starSpacing="4px"
          />
          {starError && (
            <IonText color="danger">
              <p>{starError}</p>
            </IonText>
          )}
          <IonTextarea
            placeholder="Add a comment (Optional)"
            value={comment}
            onIonChange={(e) => {
              setCommentError(undefined)
              setComment(e.detail.value!)
            }}
            rows={7}
            maxlength={1500}
          />
          {commentError && (
            <IonText color="danger">
              <p>{commentError}</p>
            </IonText>
          )}
          <IonButton expand="block" disabled={isSubmit} onClick={handleSubmit}>
            Submit Review
          </IonButton>
        </div>
      </Collapsible>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => {
          setShowToast(false)
          setToastMessage(undefined)
        }}
      />
    </>
  )
}

export default memo(Rating)
