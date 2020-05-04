import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  memo,
  ReactChildren,
} from "react"
import { IonSlides, IonSlide, IonImg } from "@ionic/react"
import Lightbox from "react-image-lightbox"
import { Image } from "../../util/types"
import "./index.css"

interface ContainerProps {
  toolbarButtons?: []
  images: Image[]
  photoIndex?: number
  isOpen?: boolean
  children?: ReactChildren[]
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
          <IonSlide key={i} style={{ height: "500px" }} onClick={handleOnClick}>
            <IonImg
              className="ScreenshotSliderImage"
              alt="screenshot"
              src={url}
            />
          </IonSlide>
        )
      }),
    [images]
  )

  // const toolBarImagesWithCallback = useMemo(
  //   () =>
  //     React.Children.map(toolbarButtons, child =>
  //       React.cloneElement(child, {
  //         onClick: () => child.props.onClick(state),
  //       })
  //     ),
  //   [toolbarButtons]
  // )

  return (
    <>
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
          // toolbarButtons={toolBarImagesWithCallback}
        />
      )}
    </>
  )
}

export default memo(ScreenshotSlider)
