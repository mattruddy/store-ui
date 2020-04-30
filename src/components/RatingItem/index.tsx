import React, { memo } from "react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { Rating } from "../../util/types"
import { IonItem, IonIcon } from "@ionic/react"
import { dateFormatter } from "../../util/utils"
import { checkmarkCircleOutline } from "ionicons/icons"

interface ContainerProps {
  rating: Rating
}

const RatingItem: React.FC<ContainerProps> = ({ rating }) => {
  return (
    <IonItem>
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
          style={{
            minHeight: "200px",
            background: "rgb(248,248,248)",
            borderRadius: "30px",
          }}
        >
          <p style={{ margin: "20px" }}>{rating.comment}</p>
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
