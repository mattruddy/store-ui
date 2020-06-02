import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  ReactChildren,
  Fragment,
} from "react"
import {
  IonSlides,
  IonSlide,
  IonImg,
  IonCol,
  IonButton,
  IonIcon,
  IonRow,
} from "@ionic/react"
import Lightbox from "react-image-lightbox"
import { Image } from "../../util/types"
import "./styles.css"
import { trash } from "ionicons/icons"

interface ContainerProps {
  toolbarButtons?: []
  images?: Image[]
  photoIndex?: number
  isOpen?: boolean
  children?: ReactChildren[]
  isEdit?: boolean
  onDelete?: (id: number) => void
}

const ScreenshotSlider: React.FC<ContainerProps> = ({
  toolbarButtons,
  children,
  ...restOfProps
}) => {
  const mounted = useRef(false)
  const [images, setImages] = useState(restOfProps.images || [])
  const [photoIndex, setPhotoIndex] = useState(restOfProps.photoIndex || 0)
  const [isOpen, setIsOpen] = useState(restOfProps.isOpen || false)

  useEffect(() => {
    if (mounted.current) {
      setIsOpen(restOfProps.isOpen || false)
      setPhotoIndex(restOfProps.photoIndex || 0)
      setImages(restOfProps.images || [])
    }
    mounted.current = true
  }, [restOfProps.photoIndex, restOfProps.isOpen])

  let mainSrc = ""
  let prevSrc = ""
  let nextSrc = ""
  if (images.length > 0) {
    mainSrc = images[photoIndex].url
    prevSrc = images[(photoIndex + images.length - 1) % images.length].url
    nextSrc = images[(photoIndex + 1) % images.length].url
  }

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleMovePrev = () =>
    setPhotoIndex((photoIndex + images.length - 1) % images.length)

  const handleMoveNext = () => setPhotoIndex((photoIndex + 1) % images.length)

  const renderSlides = useMemo(
    () =>
      images.map((image, i) => {
        const { url } = image
        const handleOnClick = () => {
          handleOpen()
          setPhotoIndex(i)
        }
        return (
          <IonCol
            className="ScreenshotCol"
            key={i}
            onClick={handleOnClick}
            size="7"
          >
            {restOfProps.isEdit && (
              <IonButton
                shape="round"
                size="small"
                style={{
                  position: "absolute",
                  bottom: "90%",
                  left: "80%",
                  zIndex: "100",
                }}
                color="inherit"
                onClick={() =>
                  restOfProps.onDelete && restOfProps.onDelete(image.imageId)
                }
              >
                <IonIcon color="danger" icon={trash} />
              </IonButton>
            )}
            <IonImg
              className="ScreenshotSliderImage"
              alt="screenshot"
              src={url}
            />
          </IonCol>
        )
      }),
    [images, restOfProps.isEdit, restOfProps.onDelete]
  )

  return (
    <IonRow className="ScreenshotRow">
      {renderSlides}
      {isOpen && (
        <Lightbox
          wrapperClassName="ScreenshotSliderLightbox"
          mainSrc={mainSrc}
          mainSrcThumbnail={mainSrc}
          prevSrc={prevSrc}
          prevSrcThumbnail={prevSrc}
          nextSrc={nextSrc}
          nextSrcThumbnail={nextSrc}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </IonRow>
  )
}

export default memo(ScreenshotSlider)
