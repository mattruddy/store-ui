import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  ReactChildren,
  Suspense,
} from "react"
import { IonIcon, IonFabButton } from "@ionic/react"
import Lightbox from "react-image-lightbox"
import { Image } from "../../util/types"
import "./styles.css"
import { trash } from "ionicons/icons"
import { useImage } from "react-image"

interface ContainerProps {
  toolbarButtons?: []
  images: Image[]
  photoIndex?: number
  isOpen?: boolean
  children?: ReactChildren[]
  isEdit?: boolean
  onDelete?: (id: number) => void
}

interface ImageProps {
  src: string
  onClick: () => void
}

const ScreenshotImage: React.FC<ImageProps> = ({ src: url, onClick }) => {
  const { src } = useImage({
    srcList: url,
    useSuspense: true,
  })

  return <img className="ScreenshotSliderImage" src={src} onClick={onClick} />
}

const ScreenshotSlider: React.FC<ContainerProps> = ({
  toolbarButtons,
  children,
  ...restOfProps
}) => {
  const mounted = useRef(false)
  const [photoIndex, setPhotoIndex] = useState(restOfProps.photoIndex || 0)
  const [isOpen, setIsOpen] = useState(restOfProps.isOpen || false)

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
            <Suspense fallback={<div></div>}>
              <ScreenshotImage src={url} onClick={handleOnClick} />
            </Suspense>
          </div>
        )
      }),
    [restOfProps.images, restOfProps.isEdit, restOfProps.onDelete]
  )

  return (
    <div className="ScreenshotRow">
      {renderSlides}
      {isOpen && !restOfProps.isEdit && (
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
