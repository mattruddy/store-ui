import React, { useState, memo, useEffect, useCallback, useMemo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonTextarea,
  IonInput,
  IonAlert,
  IonButtons,
  IonBackButton,
  IonText,
  IonTitle,
  IonImg,
  IonProgressBar,
  IonChip,
  IonLabel,
  IonGrid,
} from "@ionic/react"
import ImageUploader from "react-images-upload"
import { useParams, useHistory } from "react-router"
import { Image, PWA } from "../../util/types"
import {
  pencil,
  options,
  trash,
  close,
  checkmark,
  openOutline,
} from "ionicons/icons"
import { fixFilesRotation, noSpecialChars } from "../../util"
import { CategoryOptions, ScreenshotSlider } from "../../components"
import { RouteMap, GetMyPWADetailUrl } from "../../routes"
//@ts-ignore
import StarRatings from "react-star-ratings"
import ReactTagInput from "@pathofdev/react-tag-input"
import "@pathofdev/react-tag-input/build/index.css"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkDeletePWA, thunkUpdateApp } from "../../redux/User/actions"
import "./styles.css"

const MyPWA: React.FC = () => {
  const [screenshots, setScreenshots] = useState<Image[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(undefined)
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [desc, setDesc] = useState<string | undefined>(undefined)
  const [descError, setDescError] = useState<string | undefined>(undefined)
  const [cat, setCat] = useState<string | undefined>(undefined)
  const [catError, setCatError] = useState<string | undefined>(undefined)
  const [link, setLink] = useState<string | undefined>(undefined)
  const [addedImages, setAddedImages] = useState<File[]>([])
  const [removedImagesIds, setRemovedImagesIds] = useState<number[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagError, setTagError] = useState<boolean>(false)
  const [showDeleteAlert, setShowDeleteAlter] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { id } = useParams()
  const history = useHistory()

  const { pwa, status } = useSelector(
    ({ user: { pwas }, alerts: { status } }: ReduxCombinedState) => ({
      pwa: (() => {
        const removeDashName = id!.replace(/-/g, " ")
        return pwas.find(
          (x) => x.name.toLowerCase() === removeDashName.toLowerCase()
        ) as PWA
      })(),
      status: status,
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const removeApp = useCallback((pwa: PWA) => dispatch(thunkDeletePWA(pwa)), [
    dispatch,
  ])

  const UpdateApp = useCallback(
    (
      name: string,
      description: string,
      category: string,
      appId: number,
      tags: string[],
      newScreenshots: File[],
      deletedScreenshotIds: number[]
    ) =>
      dispatch(
        thunkUpdateApp(
          name,
          description,
          category,
          appId,
          tags,
          newScreenshots,
          deletedScreenshotIds
        )
      ),
    [dispatch]
  )

  useEffect(() => {
    load()
  }, [pwa])

  useEffect(() => {
    if (status === "success") {
      if (isEdit) {
        setIsEdit(false)
      }
    }
  }, [status, pwa])

  const onFileChange = async (files: File[]) => {
    const fixedFiles = (await fixFilesRotation(files)) as File[]
    setAddedImages(fixedFiles)
  }

  const load = async () => {
    if (pwa) {
      setIsLoading(false)
      setScreenshots(pwa.screenshots)
      setName(pwa.name)
      setCat(pwa.category)
      setDesc(pwa.description)
      setLink(pwa.link)
      setTags(pwa.tags)
      setAddedImages([])
      setRemovedImagesIds([])
    } else {
      setIsLoading(true)
    }
  }

  const onCatChange = (cat: string) => {
    setCatError(undefined)
    setCat(cat)
  }

  const editApp = async () => {
    if (pwa) {
      let count = 0
      if (!name) {
        setNameError("Name is required, max length is 25 charaters")
        count++
      }

      if (!noSpecialChars(name!)) {
        setNameError("No special charaters allowed")
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

      if (
        name === pwa.name &&
        desc === pwa.description &&
        cat === pwa.category &&
        tags === pwa.tags &&
        addedImages.length < 1 &&
        removedImagesIds.length < 1
      ) {
        setIsEdit(false)
        return
      }
      const isNameChange = name !== pwa.name
      if (count === 0) {
        UpdateApp(
          name!,
          desc!,
          cat!,
          pwa.appId,
          tags,
          addedImages,
          removedImagesIds
        )
        if (isNameChange) {
          history.replace(GetMyPWADetailUrl(name!.replace(/ /g, "-")))
        }
      }
    }
  }

  const removeImage = async (imageId: number) => {
    setScreenshots(
      (previous) => previous && previous.filter((x) => x.imageId !== imageId)
    )
    !removedImagesIds.includes(imageId) &&
      setRemovedImagesIds((previous) => [...previous, imageId])
  }

  const renderScreenshots = useMemo(() => {
    const shownScreenshots = isEdit ? screenshots : pwa && pwa.screenshots
    return (
      shownScreenshots && (
        <ScreenshotSlider
          images={shownScreenshots}
          isEdit={isEdit}
          onDelete={removeImage}
        />
      )
    )
  }, [pwa, screenshots, isEdit])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
          {pwa && <IonTitle>{pwa.name}</IonTitle>}
        </IonToolbar>
      </IonHeader>
      <IonContent className="content">
        {isLoading && (
          <IonProgressBar
            type={isLoading ? "indeterminate" : "determinate"}
            color="primary"
          />
        )}
        <IonFab
          activated={isEdit}
          style={{ paddingTop: "10px" }}
          vertical="bottom"
          horizontal="end"
          slot="fixed"
        >
          <IonFabButton class="fab fab-no-shadow">
            <IonIcon icon={options} />
          </IonFabButton>
          {isEdit ? (
            <IonFabList side="top" className="fab-no-shadow">
              <IonFabButton
                type="button"
                onClick={() => {
                  load()
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
        <IonGrid fixed>
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
                        className="line-border"
                        style={{ padding: "0", marginBottom: "5px" }}
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
                      <div className="line-border">
                        <CategoryOptions
                          onPress={onCatChange}
                          initValue={cat}
                        />
                      </div>
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
                style={{ marginRight: "10px", marginLeft: "10px" }}
                fill="outline"
                color="dark"
                onClick={() => {
                  window.open(link, "_blank")
                }}
              >
                FREE{" "}
                <IonIcon style={{ marginLeft: "10px" }} icon={openOutline} />
              </IonButton>
            )}
          </div>
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
          {isEdit ? (
            <>
              <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                <ReactTagInput
                  tags={tags}
                  onChange={(newTags) => setTags(newTags)}
                  validator={(tag) => {
                    const valid = tag.length <= 30
                    setTagError(!valid)
                    return valid
                  }}
                  removeOnBackspace={true}
                  maxTags={5}
                  placeholder="Add tags"
                />
                {tagError && (
                  <IonText color="danger">
                    <p>Must be less than 30 characters</p>
                  </IonText>
                )}
              </div>
            </>
          ) : (
            <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
              {pwa &&
                pwa.tags.map((x, i) => (
                  <IonChip key={i}>
                    <IonLabel>{x}</IonLabel>
                  </IonChip>
                ))}
            </div>
          )}
          {isEdit ? (
            <>
              <IonTextarea
                className="line-border"
                style={{ margin: "10px" }}
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
              className="bottom-line-border"
              style={{ minHeight: "200px", padding: "16px" }}
            >
              {pwa && pwa.description}
            </div>
          )}
          {renderScreenshots}
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
        </IonGrid>
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
              removeApp(pwa!)
              history.push(RouteMap.PROFILE)
            },
          },
        ]}
      />
    </IonPage>
  )
}

export default memo(MyPWA)
