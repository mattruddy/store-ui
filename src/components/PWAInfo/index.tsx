import React, { memo } from "react"
import { IonButton, IonIcon, IonImg } from "@ionic/react"
import { PWA, Rating } from "../../util/types"
import { postScore } from "../../data/dataApi"
//@ts-ignore
import StarRatings from "react-star-ratings"
import { openOutline } from "ionicons/icons"

interface ContainerProps {
  pwa: PWA
  appId: number
  currentStar: number
  starCount: number
}

const PWAInfo: React.FC<ContainerProps> = ({
  pwa,
  appId,
  currentStar,
  starCount,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <IonImg
            alt="icon"
            style={{
              height: "80px",
              width: "80px",
              borderRadius: "5px",
              margin: "10px",
            }}
            src={pwa.icon}
          />
          <div
            style={{
              paddingLeft: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              height: "70px",
            }}
          >
            <p style={{ margin: "0", fontSize: "20px" }}>{pwa.name}</p>
            <small>{pwa.category}</small>
          </div>
        </div>
        <IonButton
          class="button"
          style={{ marginRight: "10px" }}
          onClick={() => {
            postScore(appId)
            window.open(pwa.link, "_blank")
          }}
        >
          FREE <IonIcon style={{ marginLeft: "10px" }} icon={openOutline} />
        </IonButton>
      </div>
      <div style={{ marginLeft: "10px" }}>
        <StarRatings
          rating={currentStar}
          starDimension="20px"
          starSpacing="2px"
        />
        <span style={{ marginLeft: "5px" }}>({starCount})</span>
      </div>
      <h2 style={{ paddingTop: "10px", paddingLeft: "10px" }}>About</h2>
      <div style={{ height: "200px", padding: "15px", overflowY: "scroll" }}>
        {pwa.description}
      </div>
    </>
  )
}

export default memo(PWAInfo)
