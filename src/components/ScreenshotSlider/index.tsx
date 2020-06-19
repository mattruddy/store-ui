import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  ReactChildren,
} from "react"
import { IonButton, IonIcon, IonFabButton } from "@ionic/react"
import Lightbox from "react-image-lightbox"
import { Image } from "../../util/types"
import "./styles.css"
import { trash } from "ionicons/icons"
import { useInView } from "react-intersection-observer"

interface ContainerProps {
  toolbarButtons?: []
  images: Image[]
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
  const [photoIndex, setPhotoIndex] = useState(restOfProps.photoIndex || 0)
  const [isOpen, setIsOpen] = useState(restOfProps.isOpen || false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 300)
  }, [])

  useEffect(() => {
    if (mounted.current) {
      setIsOpen(restOfProps.isOpen || false)
      setPhotoIndex(restOfProps.photoIndex || 0)
    }
    mounted.current = true
  }, [restOfProps.photoIndex, restOfProps.isOpen, restOfProps.images])

  let mainSrc = ""
  let prevSrc = ""
  let nextSrc = ""
  if (restOfProps.images.length > 0) {
    mainSrc = restOfProps.images[photoIndex].url
    prevSrc =
      restOfProps.images[
        (photoIndex + restOfProps.images.length - 1) % restOfProps.images.length
      ].url
    nextSrc =
      restOfProps.images[(photoIndex + 1) % restOfProps.images.length].url
  }

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleMovePrev = () =>
    setPhotoIndex(
      (photoIndex + restOfProps.images!.length - 1) % restOfProps.images.length
    )

  const handleMoveNext = () =>
    setPhotoIndex((photoIndex + 1) % restOfProps.images.length)

  const renderSlides = useMemo(
    () =>
      restOfProps.images.map((image, i) => {
        const { url } = image
        const handleOnClick = () => {
          handleOpen()
          setPhotoIndex(i)
        }
        return (
          <div className="ScreenshotCol" key={i}>
            {restOfProps.isEdit && (
              <div className="DeleteButtonBlock">
                <IonFabButton
                  className="ScreenshotDeleteButton"
                  size="small"
                  color="transparent"
                  onClick={() =>
                    restOfProps.onDelete && restOfProps.onDelete(image.imageId)
                  }
                >
                  <IonIcon color="danger" icon={trash} />
                </IonFabButton>
              </div>
            )}
            {show && (
              <img
                className={`ScreenshotSliderImage ${show ? "fade-in" : ""}`}
                alt="screenshot"
                onClick={handleOnClick}
                src={url}
              />
            )}
          </div>
        )
      }),
    [restOfProps.images, restOfProps.isEdit, restOfProps.onDelete, show]
  )

  return (
    <div className="ScreenshotRow bottom-line-border">
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
    </div>
  )
}

export default memo(ScreenshotSlider)
