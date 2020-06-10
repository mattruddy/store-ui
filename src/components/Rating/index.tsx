import React, { useRef, useEffect, useState, memo, Fragment } from "react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import Collapsible from "react-collapsible"
import { IonTextarea, IonButton, IonText } from "@ionic/react"

interface ContainerProps {
  onSubmit: (star: number, comment?: string) => {}
}

const Rating: React.FC<ContainerProps> = ({ onSubmit }) => {
  const isUnMounting = useRef(false)

  useEffect(() => {
    return () => {
      isUnMounting.current = true
    }
  }, [])

  const [star, setStar] = useState<number>(0)
  const [starError, setStarError] = useState<string | undefined>()
  const [comment, setComment] = useState<string | undefined>()
  const [commentError, setCommentError] = useState<string | undefined>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const handleSubmit = () => {
    try {
      setIsSubmit(true)
      if (star < 1 || star > 5) {
        setStarError("Must be between 1 and 5 stars")
        return
      }

      onSubmit(star, comment)
      setComment("")
      setStar(0)
    } finally {
      setIsSubmit(false)
    }
  }

  const handleStarRatingChange = (newRating: number) => {
    if (isUnMounting.current) return
    setStarError(undefined)
    setStar(newRating)
  }

  const handleIonTextAreaChange = (e: CustomEvent) => {
    if (isUnMounting.current) return
    setCommentError(undefined)
    setComment(e.detail.value!)
  }

  return (
    <Fragment>
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
            changeRating={handleStarRatingChange}
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
            onIonChange={handleIonTextAreaChange}
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
    </Fragment>
  )
}

export default memo(Rating)
