import React, { useState, useRef, memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonSlides,
  IonSlide,
  useIonViewDidEnter,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonTextarea,
  IonInput,
  IonAlert,
  useIonViewDidLeave,
  useIonViewWillLeave,
  IonButtons,
  IonBackButton,
  IonText,
  IonToast,
  IonTitle,
  IonList,
  IonImg,
} from "@ionic/react"
import ImageUploader from "react-images-upload"
import {
  getPWA,
  putApp,
  deleteScreenshot,
  postAddScreenshots,
  deleteApp,
} from "../../data/dataApi"
import { RouteComponentProps, withRouter } from "react-router"
import { PWA as PWAType, Image } from "../../util/types"
import {
  pencil,
  options,
  trash,
  close,
  checkmark,
  openOutline,
} from "ionicons/icons"
import { fixFilesRotation } from "../../util/utils"
import { CategoryOptions, RatingItem } from "../../components"
//@ts-ignore
import StarRatings from "react-star-ratings"

interface MatchParams {
  id: string | undefined
}

interface OwnProps extends RouteComponentProps<MatchParams> {}

interface StateProps {}

interface DispatchProps {}

type PWAProps = OwnProps & StateProps & DispatchProps

const MyPWA: React.FC<PWAProps> = ({ history }) => {
  const [pwa, setPwa] = useState<PWAType>()
  const [screenshots, setScreenshots] = useState<Image[]>()
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(undefined)
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [desc, setDesc] = useState<string | undefined>(undefined)
  const [descError, setDescError] = useState<string | undefined>(undefined)
  const [cat, setCat] = useState<string | undefined>(undefined)
  const [catError, setCatError] = useState<string | undefined>(undefined)
  const [link, setLink] = useState<string | undefined>(undefined)
  const [images, setImages] = useState<File[] | undefined>(undefined)
  const [showDeleteAlert, setShowDeleteAlter] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [toastText, setToastText] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)
  const slides = useRef<any>()

  useIonViewDidEnter(() => {
    loadPWA()
    setIsLoading(false)
  }, [])

  useIonViewDidLeave(() => {
    setPwa(undefined)
    setScreenshots(undefined)
  }, [])

  useIonViewWillLeave(() => {
    setIsLoading(true)
  })

  const onFileChange = async (files: File[]) => {
    const fixedFiles = (await fixFilesRotation(files)) as File[]
    setImages(fixedFiles)
  }

  const loadPWA = async () => {
    const resp = (await getPWA(
      history.location.pathname.split("/")[2]
    )) as PWAType
    setPwa(resp)
    setScreenshots(resp.screenshots)
    setName(resp.name)
    setCat(resp.category)
    setDesc(resp.description)
    setLink(resp.link)
  }

  const onCatChange = (cat: string) => {
    setCatError(undefined)
    setCat(cat)
  }

  const editApp = async () => {
    let count = 0
    if (!name) {
      setNameError("Name is required, max length is 25 charaters")
      count++
    }

    if (!desc) {
      setDescError("Description is required")
      count++
    }

    if (!cat) {
      setCatError("Category is required")
      count++
    }

    if (images && images.length > 0) {
      addImages()
    }

    if (
      name === pwa?.name &&
      desc === pwa?.description &&
      cat === pwa?.category
    ) {
      setIsEdit(false)
      return
    }

    if (count === 0) {
      if (images && images.length > 0) {
        await postAddScreenshots(
          images as File[],
          Number(history.location.pathname.split("/")[2])
        )
      }
      const resp = await putApp(
        name!,
        desc!,
        cat!,
        Number(history.location.pathname.split("/")[2])
      )
      if (resp?.status === 200) {
        setPwa(resp.data)
        setScreenshots(resp.data.screenshots)
        setToastText("Success")
        setShowToast(true)
      }
      setIsEdit(false)
    }
  }

  const removeImage = async (imageId: number) => {
    const resp = await deleteScreenshot(imageId)
    if (resp && screenshots) {
      setScreenshots(screenshots.filter((shot) => shot.imageId !== imageId))
      slides.current.update()
    }
  }

  const addImages = async () => {
    if (pwa) {
      const resp = await postAddScreenshots(
        images as File[],
        pwa.appId as number
      )
      if (resp.length > 0) {
        setScreenshots((prev) => prev?.concat(resp))
        slides.current.update()
        setImages(undefined)
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          {pwa && <IonTitle>{pwa.name}</IonTitle>}
        </IonToolbar>
      </IonHeader>
      <IonContent className="content" style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {pwa && (
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
            )}
            {pwa && (
              <div
                style={{
                  paddingLeft: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  height: "70px",
                }}
              >
                {isEdit ? (
                  <>
                    <IonInput
                      style={{ padding: "0", boxShadow: "0 0 3px #ccc" }}
                      maxlength={25}
                      value={name}
                      onIonChange={(e) => {
                        setNameError(undefined)
                        setName(e.detail.value!)
                      }}
                    />
                    {nameError && (
                      <IonText color="danger">
                        <p>{nameError}</p>
                      </IonText>
                    )}
                  </>
                ) : (
                  <p style={{ margin: "0", fontSize: "20px" }}>{pwa.name}</p>
                )}
                {isEdit ? (
                  <>
                    <CategoryOptions onPress={onCatChange} initValue={cat} />
                    {catError && (
                      <IonText color="danger">
                        <p>{catError}</p>
                      </IonText>
                    )}
                  </>
                ) : (
                  <small>{pwa.category}</small>
                )}
              </div>
            )}
          </div>
          {pwa && (
            <IonButton
              style={{ marginRight: "10px" }}
              onClick={() => {
                window.open(link, "_blank")
              }}
            >
              FREE <IonIcon style={{ marginLeft: "10px" }} icon={openOutline} />
            </IonButton>
          )}
        </div>
        <IonFab
          activated={isEdit}
          style={{ paddingTop: "10px" }}
          vertical="bottom"
          horizontal="end"
          slot="fixed"
        >
          <IonFabButton class="fab">
            <IonIcon icon={options} />
          </IonFabButton>
          {isEdit ? (
            <IonFabList side="top">
              <IonFabButton
                type="button"
                onClick={() => {
                  setIsEdit(false)
                }}
              >
                <IonIcon icon={close} />
              </IonFabButton>
              <IonFabButton type="button" onClick={editApp}>
                <IonIcon icon={checkmark} />
              </IonFabButton>
            </IonFabList>
          ) : (
            <IonFabList side="top">
              <IonFabButton type="button" onClick={() => setIsEdit(true)}>
                <IonIcon icon={pencil} />
              </IonFabButton>
              <IonFabButton
                type="button"
                onClick={() => setShowDeleteAlter(true)}
              >
                <IonIcon icon={trash} />
              </IonFabButton>
            </IonFabList>
          )}
        </IonFab>
        {pwa && (
          <div style={{ marginLeft: "10px" }}>
            <StarRatings
              rating={pwa.averageRating}
              starDimension="20px"
              starSpacing="2px"
            />
            <span style={{ marginLeft: "5px" }}>({pwa.ratingsCount})</span>
          </div>
        )}
        {!isLoading && (
          <h2 style={{ paddingTop: "10px", paddingLeft: "10px" }}>About</h2>
        )}
        {isEdit ? (
          <>
            <IonTextarea
              style={{ margin: "10px", boxShadow: "0 0 3px #ccc" }}
              rows={10}
              value={desc}
              onIonChange={(e) => {
                setDescError(undefined)
                setDesc(e.detail.value!)
              }}
            />
            {descError && (
              <IonText color="danger">
                <p>{descError}</p>
              </IonText>
            )}
          </>
        ) : (
          <div
            style={{ height: "200px", padding: "15px", overflowY: "scroll" }}
          >
            {pwa && pwa.description}
          </div>
        )}
        {!isLoading && <h2 style={{ paddingLeft: "10px" }}>Screenshots</h2>}
        {screenshots && (
          <IonSlides
            className="slider"
            ref={slides}
            key={screenshots.map((shot) => shot.imageId).join("_")}
            pager={true}
            options={{ initialSlide: 0, speed: 400 }}
          >
            {screenshots.map((shot, idx) => (
              <IonSlide
                key={idx}
                style={{ position: "relative", height: "500px" }}
              >
                {isEdit && (
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
                    onClick={() => removeImage(shot.imageId)}
                  >
                    <IonIcon color="danger" icon={trash} />
                  </IonButton>
                )}
                <IonImg
                  alt="screenshot"
                  style={{ height: "400px", maxWidth: "93%" }}
                  src={shot.url}
                />
              </IonSlide>
            ))}
          </IonSlides>
        )}
        {isEdit && (
          <form>
            <ImageUploader
              fileContainerStyle={{
                boxShadow: "none",
              }}
              withPreview={true}
              withLabel={false}
              singleImage={false}
              withIcon={false}
              onChange={onFileChange}
              buttonText="Add screenshots"
              imgExtension={[".jpg", ".png", ".jpeg"]}
              maxFileSize={5242880}
            />
          </form>
        )}

        {!isEdit && <h2 style={{ paddingLeft: "10px" }}>Reviews</h2>}
        {!isEdit && pwa && pwa.ratings && (
          <IonList>
            {pwa.ratings.map((rating, idx) => (
              <RatingItem key={idx} rating={rating} />
            ))}
          </IonList>
        )}
      </IonContent>
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlter(false)}
        header={`Delete ${pwa?.name}`}
        message="Are you sure you want to delete this app?"
        buttons={[
          {
            text: "Cancel",
            handler: () => setShowDeleteAlter(false),
          },
          {
            text: "Delete",
            handler: async () => {
              const resp = await deleteApp(pwa?.appId!)
              history.push("/profile")
            },
          },
        ]}
      />
      <IonToast
        isOpen={showToast}
        message={toastText}
        onDidDismiss={() => {
          setShowToast(false)
          setToastText("")
        }}
        duration={3000}
      />
    </IonPage>
  )
}

export default withRouter(memo(MyPWA))
