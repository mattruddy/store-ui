import React, { useRef, useEffect, useState, memo, Fragment } from "react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { IonTextarea, IonButton, IonText } from "@ionic/react"
import { FormItem } from ".."

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
  const [comment, setComment] = useState<string | undefined>()
  const [isSubmit, setIsSubmit] = useState<boolean>(false)

  const handleSubmit = () => {
    setIsSubmit(true)
    if (star < 1 || star > 5) {
      return
    }

    onSubmit(star, comment)
    setComment("")
    setStar(0)
    setIsSubmit(false)
  }

  const handleStarRatingChange = (newRating: number) => {
    if (isUnMounting.current) return
    setStar(newRating)
  }

  const handleIonTextAreaChange = (e: CustomEvent) => {
    if (isUnMounting.current) return
    setComment(e.detail.value!)
  }

  return (
    <Fragment>
      <FormItem
        name="Stars"
        showError={isSubmit && (star < 1 || star > 5)}
        errorMessage="Must be between 1 and 5 stars"
        lines="none"
      >
        <div style={{ paddingTop: "16px" }}>
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
        </div>
      </FormItem>
      <FormItem name="Comment" showError={false} errorMessage="" lines="none">
        <IonTextarea
          placeholder="Add a comment (Optional)"
          value={comment}
          onIonChange={handleIonTextAreaChange}
          rows={7}
          maxlength={1500}
        />
      </FormItem>
      <IonButton
        expand="block"
        fill="outline"
        color="dark"
        onClick={handleSubmit}
      >
        Submit Review
      </IonButton>
    </Fragment>
  )
}

export default memo(Rating)
