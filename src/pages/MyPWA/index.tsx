import React, {
  useState,
  memo,
  useEffect,
  useCallback,
  useMemo,
  Fragment,
} from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonAlert,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonProgressBar,
  IonGrid,
  IonIcon,
  IonFabButton,
  IonCard,
  IonCardContent,
  useIonViewDidLeave,
  IonCol,
  IonRow,
} from "@ionic/react"
import ImageUploader from "react-images-upload"
import { useParams, useHistory } from "react-router"
import { Image, PWA, DevLog } from "../../util/types"
import { pencil, options, trash, close, checkmark } from "ionicons/icons"
import { ScreenshotSlider, PWAInfo } from "../../components"
import { RouteMap, GetMyPWADetailUrl } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import {
  thunkDeletePWA,
  thunkUpdateApp,
  thunkRemoveDevLog,
} from "../../redux/User/actions"
import Popover from "../../components/Popover"
import "./styles.css"
import StarsListModal from "../../components/StarsListModal"
import { thunkAddRating } from "../../redux/PWAs/actions"
import { Axios } from "../../redux/Actions"
import DevLogCard from "../../components/DevLogCard"

const MyPWA: React.FC = () => {
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [screenshots, setScreenshots] = useState<Image[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [name, setName] = useState<string>()
  const [desc, setDesc] = useState<string>()
  const [cat, setCat] = useState<string>()
  const [addedImages, setAddedImages] = useState<File[]>([])
  const [removedImagesIds, setRemovedImagesIds] = useState<number[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [showDeleteAlert, setShowDeleteAlter] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [devLogs, setDevLogs] = useState<DevLog[]>([])
  const { appName } = useParams()
  const history = useHistory()

  const { pwa, status } = useSelector(
    ({ user: { pwas }, alerts: { status } }: ReduxCombinedState) => ({
      pwa: (() => {
        const removeDashName = appName?.replace(/-/g, " ")
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
  const addRating = useCallback(
    async (appId: number) => dispatch(thunkAddRating(appId)),
    [dispatch]
  )
  const deleteDevLog = useCallback(
    (logId: number) => dispatch(thunkRemoveDevLog(logId)),
    [dispatch]
  )

  useEffect(() => {
    pwa && updateStateProperties()
  }, [pwa])

  useEffect(() => {
    setIsLoading(false)
  }, [status])

  useIonViewDidLeave(() => {
    setDevLogs([])
  })

  useEffect(() => {
    if (pwa) {
      ;(async () => {
        const resp = await (await Axios()).get(
          `secure/dev-logs/app/${pwa.appId}`
        )
        setDevLogs(resp.data as DevLog[])
      })()
    }
  }, [pwa])

  const onFileChange = (files: File[]) => {
    setAddedImages(files)
  }

  const updateStateProperties = () => {
    setScreenshots(pwa.screenshots)
    setName(pwa.name)
    setCat(pwa.category)
    setDesc(pwa.description)
    setTags(pwa.tags)
    setAddedImages([])
    setRemovedImagesIds([])
  }

  const shouldUpload = (): boolean => {
    return !(
      (name === pwa.name &&
        desc === pwa.description &&
        cat === pwa.category &&
        tags === pwa.tags &&
        addedImages.length < 1 &&
        removedImagesIds.length < 1) ||
      !name ||
      !desc ||
      !cat ||
      desc.length > 1500
    )
  }

  const editApp = () => {
    if (shouldUpload()) {
      setIsLoading(true)
      const isNameChange = name !== pwa.name
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
    } else {
      updateStateProperties()
    }
    setIsEdit(false)
  }

  const handleRemoveDevLog = (logId: number) => {
    deleteDevLog(logId)
    setDevLogs((prev) => prev.filter((x) => x.logId !== logId))
  }

  const removeImage = useCallback(
    (imageId: number) => {
      setScreenshots(
        (previous) => previous && previous.filter((x) => x.imageId !== imageId)
      )
      !removedImagesIds.includes(imageId) &&
        setRemovedImagesIds((previous) => [...previous, imageId])
    },
    [removedImagesIds]
  )

  const renderScreenshots = useMemo(() => {
    const shownScreenshots = isEdit ? screenshots : pwa && pwa.screenshots
    return (
      shownScreenshots && (
        <IonCard className="line-around">
          <IonCardContent>
            <ScreenshotSlider
              images={shownScreenshots}
              isEdit={isEdit}
              onDelete={removeImage}
            />
          </IonCardContent>
        </IonCard>
      )
    )
  }, [pwa, screenshots, isEdit, removeImage])

  const renderEditButtons = useMemo(() => {
    return (
      isEdit && (
        <Fragment>
          <IonFabButton className="MyPWAFab" size="small" onClick={editApp}>
            <IonIcon color="success" icon={checkmark} />
          </IonFabButton>
          <IonFabButton
            className="MyPWAFab"
            size="small"
            onClick={() => {
              updateStateProperties()
              setIsEdit(false)
            }}
          >
            <IonIcon color="danger" icon={close} />
          </IonFabButton>
        </Fragment>
      )
    )
  }, [isEdit, editApp])

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={RouteMap.PROFILE} />
          </IonButtons>
          {pwa && <IonTitle>{pwa.name}</IonTitle>}
          <IonButtons slot="end">
            {renderEditButtons}
            <Popover
              showPopover={showPopover}
              setShowPopover={setShowPopover}
              icon={options}
              items={[
                { name: "Edit", action: () => setIsEdit(true), icon: pencil },
                {
                  name: "Delete",
                  action: () => setShowDeleteAlter(true),
                  icon: trash,
                },
              ]}
            />
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent className="content">
        <IonGrid>
          <IonRow>
            {pwa && (
              <IonCol size="12">
                <PWAInfo
                  pwa={pwa}
                  isMyPwa={true}
                  isLoggedIn={true}
                  onStar={addRating}
                  openModal={() => setIsOpen(true)}
                  isEdit={isEdit}
                  name={name}
                  cat={cat}
                  desc={desc}
                  tags={tags}
                  setName={setName}
                  setCat={setCat}
                  setDesc={setDesc}
                  setTags={setTags}
                />
              </IonCol>
            )}
            <IonCol
              size="12"
              sizeMd={devLogs.length > 0 ? "6" : "12"}
              pushMd={devLogs.length > 0 ? "6" : "0"}
            >
              {renderScreenshots}
              {isEdit && (
                <ImageUploader
                  fileContainerStyle={{
                    boxShadow: "none",
                    background: "inherit",
                    padding: "0",
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
              )}
            </IonCol>
            {devLogs.length > 0 && (
              <IonCol size="12" sizeMd="6" pullMd="6">
                {devLogs.map((log, idx) => (
                  <DevLogCard
                    key={idx}
                    devLog={log}
                    onDelete={handleRemoveDevLog}
                    isLinkable={false}
                  />
                ))}
              </IonCol>
            )}
          </IonRow>
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
      {pwa && pwa.appRatings && (
        <StarsListModal
          isOpen={isOpen}
          onDidDismiss={() => setIsOpen(false)}
          ratings={pwa.appRatings.ratings}
        />
      )}
    </IonPage>
  )
}

export default memo(MyPWA)
