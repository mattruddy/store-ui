import React, { memo } from "react"
import { IonButton, IonIcon, IonChip, IonLabel } from "@ionic/react"
import { ShareUrl } from "../"
import { PWA } from "../../util/types"
import ReactGA from "react-ga"

//@ts-ignore
import StarRatings from "react-star-ratings"
import { openOutline } from "ionicons/icons"
import { Axios } from "../../redux/Actions"

interface ContainerProps {
  pwa: PWA
  appId: number
  currentStar: number
  starCount: number
  tags: string[]
}

const PWAInfo: React.FC<ContainerProps> = ({
  pwa,
  appId,
  currentStar,
  starCount,
  tags,
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
          <img
            alt="icon"
            style={{
              height: "80px",
              width: "80px",
              borderRadius: "6px",
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
          color="dark"
          fill="outline"
          onClick={() => {
            ;(async () => await (await Axios()).post(`public/pwa/${appId}`))()
            ReactGA.event({
              category: "installed",
              action: pwa.name,
            })
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
          starRatedColor="var(--light-rating)"
          starEmptyColor="var(--dark-rating)"
        />
        <span style={{ marginLeft: "5px" }}>({starCount})</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <ShareUrl title={pwa.name} />
      </div>
      <div style={{ padding: "10px" }}>
        {tags.map((x, i) => (
          <IonChip key={i}>
            <IonLabel>{x}</IonLabel>
          </IonChip>
        ))}
      </div>
      <div
        className="bottom-line-border"
        style={{ padding: "16px", minHeight: "200px" }}
      >
        {pwa.description}
      </div>
    </>
  )
}

export default memo(PWAInfo)
