import React, { memo } from "react"
import { IonCard, IonCardContent, IonRippleEffect, IonImg } from "@ionic/react"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { PWA } from "../../util/types"

interface ContainerProps {
  pwa: PWA
  url: string
  history: any
}

const styles = { root: { height: 330 } }

const PWACard: React.FC<ContainerProps> = ({ pwa, url, history }) => {
  const handleClick = () => history.push(`${url}/${pwa.name.replace(" ", "-")}`)
  return (
    <IonCard
      className="fade-in box-shadow-hover"
      button
      onClick={handleClick}
      style={styles.root}
    >
      <IonCardContent style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <IonImg
            alt="icon"
            style={{ height: "200px", width: "200px", borderRadius: "5px" }}
            src={pwa.icon}
          />
        </div>
        <div style={{ paddingLeft: "10px" }}>
          <p style={{ margin: "0", fontSize: "19px" }}>{pwa.name}</p>
          <small>{pwa.category}</small>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "50px",
          }}
        >
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
  )
}

export default memo(PWACard)
