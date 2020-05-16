import React, { useEffect, useState, memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonModal,
  IonList,
  IonInput,
  IonTextarea,
  IonText,
  IonImg,
  IonGrid,
  IonRow,
  IonIcon,
  IonButtons,
  IonFab,
  IonFabButton,
  IonFabList,
  IonAlert,
  useIonViewDidEnter,
  IonCol,
  useIonViewWillLeave,
  IonToast,
  IonSpinner,
  useIonViewDidLeave,
  IonProgressBar,
} from "@ionic/react"
import {
  getProfile,
  postApp,
  getLighthouseReport,
  getManifest,
  getImage,
} from "../../data/dataApi"
import { RouteComponentProps, withRouter } from "react-router"
import ImageUploader from "react-images-upload"
import { connect } from "../../data/connect"
import { CategoryOptions, Lighthouse, PWACard } from "../../components"
import { UserProfile, PWA } from "../../util/types"
import { add, menu, logOut, contractSharp } from "ionicons/icons"
import { setToken, setIsLoggedIn, addApp } from "../../data/user/user.actions"
import { RouteMap } from "../../routes"
import { noSpecialChars } from "../../util"
import "./styles.css"

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken
  setIsLoggedIn: typeof setIsLoggedIn
  addApp: typeof addApp
}

interface StateProps {
  pwas?: PWA[]
  username?: string
}

interface ProfileProps extends OwnProps, DispatchProps, StateProps {}

interface LighthouseTest {
  pass: boolean
  url: string
  iosIcon: boolean
  installable: boolean
  worksOffline: boolean
  error: boolean
}

const Profile: React.FC<ProfileProps> = ({
  history,
  setToken,
  setIsLoggedIn,
  addApp,
  pwas,
  username,
}) => {
  const [url, setUrl] = useState<string>("")
  const [urlError, setUrlError] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string>("")
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [desc, setDesc] = useState<string>("")
  const [descError, setDescError] = useState<string | undefined>(undefined)
  const [cat, setCat] = useState<string>("")
  const [catError, setCatError] = useState<string | undefined>(undefined)
  const [icon, setIcon] = useState<File | undefined>(undefined)
  const [iconError, setIconError] = useState<string | undefined>(undefined)
  const [screenshots, setScreenshots] = useState<File[] | undefined>(undefined)
  const [screenshotError, setScreenshotError] = useState<string | undefined>(
    undefined
  )
  const [showModal, setShowModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isValidLink, setIsValidLink] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [toastMessage, setToastMessage] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [lightHouseLoading, setLightHouseLoading] = useState<boolean>(false)
  const [lightHouseTests, setLightHouseTests] = useState<LighthouseTest[]>([])

  useEffect(() => {
    if (pwas) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [pwas])

  const onPress = (option: string) => {
    setCatError(undefined)
    setCat(option)
  }

  const onIconChange = (files: File[]) => {
    setIconError(undefined)
    setIcon(files[0])
  }

  const onScreenshotsChange = (files: File[]) => {
    setScreenshotError(undefined)
    setScreenshots(files)
  }

  const onAddPWA = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmit(true)
    let check = 0
    if (!name) {
      setNameError("Name is required")
      check++
    }

    if (!noSpecialChars(name)) {
      setNameError("No Special Chars allowed")
      check++
    }

    if (!icon) {
      setIconError("Icon is required")
      check++
    }

    if (!url) {
      setUrlError("Link is required")
      check++
    }

    if (!/^((https))/.test(url)) {
      setIsValidLink(false)
      check++
    }

    if (!desc) {
      setDescError("Description is required")
      check++
    }

    if (!cat) {
      setCatError("Category is required")
      check++
    }

    if (!screenshots) {
      setScreenshotError("Atleast 1 screenshot is required")
      check++
    }

    if (screenshots && screenshots.length > 6) {
      setScreenshotError("Max of 6 screenshots")
      check++
    }

    if (check === 0) {
      const resp = await postApp(
        name,
        desc,
        url,
        cat,
        icon as File,
        screenshots as File[]
      )
      if (resp && resp.data && resp.data.message) {
        setToastMessage(resp.data.message)
        setShowToast(true)
      } else if (resp && resp.appId) {
        addApp(resp as PWA)
        setName("")
        setDesc("")
        setCat("")
        setUrl("")
        setIcon(undefined)
        setScreenshots(undefined)
        setShowModal(false)
        setToastMessage("Success")
        setShowToast(true)
      }
    }
    setIsSubmit(false)
  }

  const loadPwas = (filter: string) => {
    if (pwas) {
      const filteredPwas = pwas.filter((pwa) => pwa.status === filter)
      if (filteredPwas.length > 0) {
        return filteredPwas.map((pwa, idx) => (
          <IonCol key={idx} sizeXs="6" sizeSm="4" sizeMd="3">
            <PWACard url="/mypwa" pwa={pwa} />
            {filter === "DENIED" && (
              <>
                <span style={{ paddingLeft: "15px" }}>
                  <strong>Reason</strong>
                </span>
                <p style={{ padding: "15px" }}>{pwa.reason}</p>
              </>
            )}
          </IonCol>
        ))
      } else {
        return (
          <IonCol
            style={{
              width: "100%",
              margin: "20px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 0 3px #ccc",
            }}
          >
            <small
              style={{ paddingLeft: "15px", color: "rgb(115, 115, 115)" }}
            >{`No ${filter.toLowerCase()} apps yet`}</small>
          </IonCol>
        )
      }
    }
  }

  const getLightHouseData = async (url: string) => {
    try {
      setLightHouseLoading(true)
      const response = await getLighthouseReport(url)
      if (response.status === 200) {
        if (response.data) {
          if (response.data.lighthouseResult) {
            const data = response.data
            const lightHouseData = data.lighthouseResult
            const iosIconTest =
              lightHouseData.audits["apple-touch-icon"].score > 0 ? true : false
            const installableTest =
              lightHouseData.audits["installable-manifest"].score > 0
                ? true
                : false
            const worksOfflineTest =
              lightHouseData.audits["works-offline"].score > 0 ? true : false
            setLightHouseTests([
              {
                pass:
                  iosIconTest &&
                  worksOfflineTest &&
                  (installableTest as boolean),
                url: url,
                iosIcon: iosIconTest,
                installable: installableTest,
                worksOffline: worksOfflineTest,
                error: false,
              } as LighthouseTest,
              ...lightHouseTests.filter((x) => x.url !== url),
            ])
            //passed all tests.
          } else {
            console.error(`No lighthouse result`)
          }
        }
      }
    } catch (e) {
      console.error(`Issue getting lighthouse data: ${JSON.stringify(e.data)}`)

      setLightHouseTests([
        {
          pass: false,
          url: url,
          iosIcon: false,
          installable: false,
          worksOffline: false,
          error: true,
        } as LighthouseTest,
        ...lightHouseTests.filter((x) => x.url !== url),
      ])
    }

    setLightHouseLoading(false)
  }

  // TODO: Get this working without CORS errors.
  const getIcon = async (url: string) => {
    try {
      const inputURL = new URL(url)
      const response = await getManifest(inputURL.origin)
      if (response.status === 200) {
        const { data } = response
        const manifest = data.manifest
        if (manifest.icons) {
          const size512 = manifest.icons.find(
            (x: { sizes: string }) => x.sizes === "512x512"
          )
          const imageResponse = await getImage(
            `${inputURL.origin}/${
              size512 ? size512.src : manifest.icons[0].src
            }`
          )
          console.log(imageResponse)
          return imageResponse.data
        } else {
          console.error(`Missing icons in manifest`)
        }
      } else {
        console.error(`Error getting manifest: ${response}`)
      }
    } catch (e) {
      console.error(`Could not get the icon: ${e}`)
    }
  }

  return (
    <IonPage>
      <IonModal
        isOpen={showModal}
        swipeToClose={true}
        onDidDismiss={() => {
          setShowModal(false)
          setIcon(undefined)
          setScreenshots(undefined)
        }}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
            </IonButtons>
            <IonTitle>PWA</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ overflow: "hidden" }}>
          <form>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  name="name"
                  type="text"
                  spellCheck={false}
                  value={name}
                  maxlength={25}
                  onIonChange={(e) => {
                    setName(e.detail.value!)
                    if (!noSpecialChars(e.detail.value!)) {
                      setNameError("No special characters allowed")
                    } else {
                      setNameError(undefined)
                    }
                  }}
                  required
                />
                {nameError && (
                  <IonText color="danger">
                    <p>{nameError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <ImageUploader
                  fileContainerStyle={{
                    boxShadow: "none",
                  }}
                  withPreview={true}
                  withLabel={false}
                  singleImage={true}
                  withIcon={false}
                  buttonText="Choose icon"
                  onChange={onIconChange}
                  imgExtension={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
                {iconError && (
                  <IonText color="danger">
                    <p>{iconError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Link</IonLabel>
                <IonInput
                  name="link"
                  type="text"
                  maxlength={80}
                  spellCheck={false}
                  value={url}
                  onIonChange={(e) => {
                    setUrlError(undefined)
                    const urlVal = e.detail.value!
                    if (urlVal === "") {
                      setIsValidLink(true)
                    } else {
                      const isValid = /^((https))/.test(urlVal)
                      setIsValidLink(isValid)
                    }
                    setUrl(e.detail.value!)
                  }}
                  required
                />
                {!isValidLink && (
                  <IonText color="danger">
                    <p className="ion-padding-start">
                      Invald link (https required)
                    </p>
                  </IonText>
                )}
                {urlError && (
                  <IonText color="danger">
                    <p>{urlError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  name="desc"
                  placeholder="Please describe your PWA"
                  rows={6}
                  spellCheck={true}
                  value={desc}
                  maxlength={1500}
                  onIonChange={(e) => {
                    setDescError(undefined)
                    setDesc(e.detail.value!)
                  }}
                  required
                />
                {descError && (
                  <IonText color="danger">
                    <p>{descError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <CategoryOptions onPress={onPress} initValue={cat} />
                {catError && (
                  <IonText color="danger">
                    <p>{catError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <ImageUploader
                  fileContainerStyle={{
                    boxShadow: "none",
                  }}
                  withPreview={true}
                  withLabel={false}
                  singleImage={false}
                  withIcon={false}
                  onChange={onScreenshotsChange}
                  buttonText="Choose screenshots"
                  imgExtension={[".jpg", ".png", ".jpeg"]}
                  maxFileSize={5242880}
                />
                {screenshotError && (
                  <IonText color="danger">
                    <p>{screenshotError}</p>
                  </IonText>
                )}
              </IonItem>
            </IonList>
          </form>
        </IonContent>
        {isValidLink &&
          url !== "" &&
          !lightHouseTests.some((x) => x.url === url && x.pass) && (
            <IonButton
              expand="block"
              onClick={() => {
                if (url) {
                  getLightHouseData(url)
                  console.log(lightHouseTests)
                }
              }}
              disabled={lightHouseLoading}
            >
              {lightHouseLoading ? (
                <IonSpinner />
              ) : (
                <p>Run Lighthouse PWA Check</p>
              )}
            </IonButton>
          )}
        {lightHouseTests.some((x) => x.url === url && !x.error) && (
          <Lighthouse
            installable={
              lightHouseTests.find((x) => x.url === url)!.installable
            }
            iosIcon={lightHouseTests.find((x) => x.url === url)!.iosIcon}
            runsOffline={
              lightHouseTests.find((x) => x.url === url)!.worksOffline
            }
          />
        )}
        {lightHouseTests.some((x) => x.url === url && x.error) && (
          <IonRow>
            <IonCol>
              <IonText color="danger">
                <p>
                  There was an error running your site through Lighthouse.
                  Please contact support if you think this is a problem with the
                  store.
                </p>
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {lightHouseTests.some((x) => x.url === url && !x.error) &&
          (lightHouseTests.some((x) => x.url === url && x.pass) ? (
            <IonButton expand="block" onClick={onAddPWA} disabled={isSubmit}>
              Submit
            </IonButton>
          ) : (
            <IonRow>
              <IonCol>
                <IonText color="danger">
                  <p>Your app has not passed the proper tests on Lighthouse.</p>
                </IonText>
              </IonCol>
            </IonRow>
          ))}
      </IonModal>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              className="ProfileSupportButton"
              onClick={() => history.push(RouteMap.SUPPORT)}
            >
              SUPPORT
            </IonButton>
          </IonButtons>
          <IonTitle>{username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
        {isLoading && (
          <IonProgressBar
            type={isLoading ? "indeterminate" : "determinate"}
            color="primary"
          />
        )}
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton class="fab">
            <IonIcon icon={menu} />
          </IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton type="button" onClick={() => setShowAlert(true)}>
              <IonIcon icon={logOut} />
            </IonFabButton>
            <IonFabButton type="button" onClick={() => setShowModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonGrid>
          {!isLoading && <h2 style={{ marginLeft: "20px" }}>Approved</h2>}
          <IonRow>{loadPwas("APPROVED")}</IonRow>
          {!isLoading && <h2 style={{ marginLeft: "20px" }}>Pending</h2>}
          <IonRow>{loadPwas("PENDING")}</IonRow>
          {!isLoading && <h2 style={{ marginLeft: "20px" }}>Denied</h2>}
          <IonRow>{loadPwas("DENIED")}</IonRow>
        </IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Logout"
          message="Are you sure you want to log out?"
          buttons={[
            {
              text: "Cancel",
              handler: () => setShowAlert(false),
            },
            {
              text: "Logout",
              handler: () => {
                setToken(undefined)
                setIsLoggedIn(false)
                setName("")
                setDesc("")
                setCat("")
                setUrl("")
                setIcon(undefined)
                setScreenshots(undefined)
                setShowModal(false)
                history.push(RouteMap.LOGIN)
              },
            },
          ]}
        />
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        duration={3000}
        message={toastMessage}
        position="bottom"
      />
    </IonPage>
  )
}

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    pwas: state.user.pwas,
    username: state.user.username,
  }),

  mapDispatchToProps: {
    setToken,
    setIsLoggedIn,
    addApp,
  },
  component: withRouter(memo(Profile)),
})
