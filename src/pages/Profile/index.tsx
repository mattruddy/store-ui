import React, {
  useEffect,
  useState,
  memo,
  useCallback,
  useMemo,
  Fragment,
} from "react"
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
  IonGrid,
  IonRow,
  IonIcon,
  IonButtons,
  IonFab,
  IonFabButton,
  IonFabList,
  IonAlert,
  IonCol,
  IonToast,
  IonSpinner,
  IonProgressBar,
} from "@ionic/react"
import { withRouter, useHistory } from "react-router"
import ImageUploader from "react-images-upload"
import { CategoryOptions, Lighthouse, PWACard } from "../../components"
import { add, menu, logOut, contractSharp } from "ionicons/icons"
import { RouteMap } from "../../routes"
import { noSpecialChars } from "../../util"
import "./styles.css"
import ReactTagInput from "@pathofdev/react-tag-input"
import "@pathofdev/react-tag-input/build/index.css"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch } from "react-redux"
import { thunkLogout, thunkAddPWA } from "../../redux/User/actions"
import Axios from "axios"

interface LighthouseTest {
  pass: boolean
  url: string
  iosIcon: boolean
  installable: boolean
  worksOffline: boolean
  error: boolean
}

const Profile: React.FC = () => {
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
  const [toastMessage, setToastMessage] = useState<string>()
  const [showToast, setShowToast] = useState<boolean>(false)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [lightHouseLoading, setLightHouseLoading] = useState<boolean>(false)
  const [lightHouseTests, setLightHouseTests] = useState<LighthouseTest[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagError, setTagError] = useState<boolean>(false)
  const history = useHistory()

  const { pwas, username, isLoading, isLoggedIn, status } = useSelector(
    ({
      user: { pwas, username, loading, isLoggedIn },
      alerts: { status },
    }: ReduxCombinedState) => ({
      pwas: pwas,
      username: username,
      isLoading: loading,
      isLoggedIn: isLoggedIn,
      status: status,
    })
  )

  const dispatch = useDispatch()
  const logout = useCallback(() => dispatch(thunkLogout()), [dispatch])
  const addApp = useCallback(
    async (
      name: string,
      description: string,
      url: string,
      category: string,
      icon: File,
      screenshots: File[],
      tags: string[]
    ) => {
      dispatch(
        thunkAddPWA(name, description, url, category, icon, screenshots, tags)
      )
    },
    [dispatch]
  )

  useEffect(() => {
    if (!isLoggedIn) {
      history.push(RouteMap.LOGIN)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (status === "success" && showModal) {
      setShowModal(false)
      setName("")
      setDesc("")
      setCat("")
      setUrl("")
      setIcon(undefined)
      setScreenshots(undefined)
    }
  }, [status])

  const onCatPress = (option: string) => {
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
      await addApp(name, desc, url, cat, icon!, screenshots!, tags)
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
      const response = await Axios.request({
        url: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&category=PWA`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
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

  const renderAppsSections: JSX.Element = useMemo(
    () => (
      <Fragment>
        {!isLoading && pwas && (
          <Fragment>
            <h2 style={{ marginLeft: "20px" }}>Approved</h2>
            <IonRow>{loadPwas("APPROVED")}</IonRow>
            <h2 style={{ marginLeft: "20px" }}>Pending</h2>
            <IonRow>{loadPwas("PENDING")}</IonRow>
            <h2 style={{ marginLeft: "20px" }}>Denied</h2>
            <IonRow>{loadPwas("DENIED")}</IonRow>
          </Fragment>
        )}
      </Fragment>
    ),
    [pwas, isLoading]
  )

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
                <IonLabel position="stacked">Tags</IonLabel>
                <div
                  style={{
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    width: "100%",
                  }}
                >
                  <ReactTagInput
                    tags={tags}
                    onChange={(newTags) => {
                      setTags(newTags)
                    }}
                    validator={(tag) => {
                      const valid = tag.length <= 30
                      setTagError(!valid)
                      return valid
                    }}
                    removeOnBackspace={true}
                    maxTags={5}
                    placeholder="Add tags"
                  />
                </div>
                {tagError && (
                  <IonText color="danger">
                    <p>Must be less than 30 characters</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Icon</IonLabel>
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
                <IonLabel position="stacked">Category</IonLabel>
                <CategoryOptions onPress={onCatPress} initValue={cat} />
                {catError && (
                  <IonText color="danger">
                    <p>{catError}</p>
                  </IonText>
                )}
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Screenshots</IonLabel>
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
        <IonGrid>{renderAppsSections}</IonGrid>
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
                setName("")
                setDesc("")
                setCat("")
                setUrl("")
                logout()
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

export default withRouter(memo(Profile))
