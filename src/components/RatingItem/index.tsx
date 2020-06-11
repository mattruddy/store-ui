import React, { memo } from "react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { Rating } from "../../util/types"
import { IonItem, IonIcon } from "@ionic/react"
import { dateFormatter } from "../../util"
import { checkmarkCircleOutline } from "ionicons/icons"

interface ContainerProps {
  rating: Rating
}

const RatingItem: React.FC<ContainerProps> = ({ rating }) => {
  return (
    <IonItem className="content" lines="none">
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <StarRatings
            rating={rating.star}
            starDimension="20px"
            starSpacing="2px"
          />
        </div>
        <div
          className="line-border"
          style={{
            minHeight: "200px",
          }}
        >
          <p style={{ margin: "12px" }}>{rating.comment}</p>
        </div>
        <div
          style={{
            fontSize: "15px",
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <i>
            {rating.from !== "anonymous" && (
              <IonIcon
                style={{ color: "blue" }}
                icon={checkmarkCircleOutline}
              />
            )}{" "}
            {rating.from} <small>{dateFormatter(rating.createdAt)}</small>
          </i>
        </div>
      </div>
    </IonItem>
  )
}

export default memo(RatingItem)
