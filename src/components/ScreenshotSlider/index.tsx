import React, { memo } from "react"
import { IonSlides, IonSlide, IonImg } from "@ionic/react"
import { Image } from "../../util/types"
import "./index.css"

interface ContainerProps {
  screenshots: Image[]
}

const ScreenshotSlider: React.FC<ContainerProps> = ({ screenshots }) => {
  return (
    <IonSlides
      className="slider"
      key={screenshots.map((shot) => shot.imageId).join("_")}
      pager={true}
      options={{
        initialSlide: 0,
        speed: 400,
      }}
    >
      {screenshots.map((shot, idx) => (
        <IonSlide style={{ height: "500px" }} key={idx}>
          <IonImg
            alt="screenshot"
            style={{ height: "400px", maxWidth: "93%" }}
            src={shot.url}
          />
        </IonSlide>
      ))}
    </IonSlides>
  )
}

export default memo(ScreenshotSlider)
