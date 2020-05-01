import React, { useMemo, memo } from "react"
import { IonSlides, IonSlide, IonImg } from "@ionic/react"
import { Image } from "../../util/types"
import "./index.css"

interface ContainerProps {
  screenshots: Image[]
}

const ScreenshotSlider: React.FC<ContainerProps> = ({ screenshots }) => {
  const renderSlides = useMemo(
    () =>
      screenshots.map(({ url }, i) => (
        <IonSlide key={i} style={{ height: "500px" }}>
          <IonImg
            alt="screenshot"
            style={{ height: "400px", maxWidth: "93%" }}
            src={url}
          />
        </IonSlide>
      )),
    [screenshots]
  )
  return (
    <IonSlides
      className="slider"
      pager={true}
      options={{
        initialSlide: 0,
        speed: 400,
      }}
    >
      {renderSlides}
    </IonSlides>
  )
}

export default memo(ScreenshotSlider)
