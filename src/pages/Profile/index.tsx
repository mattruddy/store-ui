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
  IonSpinner,
  IonProgressBar,
} from "@ionic/react"
import { withRouter, useHistory } from "react-router"
import { Lighthouse, PWACard } from "../../components"
import { add, menu, logOut, contractSharp } from "ionicons/icons"
import { RouteMap } from "../../routes"
import { noSpecialChars } from "../../util"
import "@pathofdev/react-tag-input/build/index.css"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch } from "react-redux"
import { thunkLogout, thunkAddPWA } from "../../redux/User/actions"
import Axios from "axios"
import SumbitAppModal from "../../components/SumbitAppModal"

interface LighthouseTest {
  pass: boolean
  url: string
  iosIcon: boolean
  installable: boolean
  worksOffline: boolean
  error: boolean
}

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [lightHouseLoading, setLightHouseLoading] = useState<boolean>(false)
  const [lightHouseTests, setLightHouseTests] = useState<LighthouseTest[]>([])
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
    }
  }, [status])

  // const onAddPWA = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsSubmit(true)
  //   let check = 0
  //   if (!name) {
  //     check++
  //   }

  //   if (!noSpecialChars(name)) {
  //     check++
  //   }

  //   if (!icon) {
  //     check++
  //   }

  //   if (!url) {
  //     check++
  //   }

  //   if (!/^((https))/.test(url)) {
  //     check++
  //   }

  //   if (!desc) {
  //     check++
  //   }

  //   if (!cat) {
  //     check++
  //   }

  //   if (!screenshots) {
  //     check++
  //   }

  //   if (screenshots && screenshots.length > 6) {
  //     check++
  //   }

  //   if (check === 0) {
  //     addApp(name, desc, url, cat, icon!, screenshots!, tags)
  //   }
  //   setIsSubmit(false)
  // }

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
      <SumbitAppModal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        onSubmit={addApp}
      />
      {/* {isValidLink &&
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
          installable={lightHouseTests.find((x) => x.url === url)!.installable}
          iosIcon={lightHouseTests.find((x) => x.url === url)!.iosIcon}
          runsOffline={lightHouseTests.find((x) => x.url === url)!.worksOffline}
        />
      )}
      {lightHouseTests.some((x) => x.url === true && x.error) && (
        <IonRow>
          <IonCol>
            <IonText color="danger">
              <p>
                There was an error running your site through Lighthouse. Please
                contact support if you think this is a problem with the store.
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
        ))} */}
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              fill="clear"
              onClick={() => history.push(RouteMap.SUPPORT)}
            >
              SUPPORT
            </IonButton>
          </IonButtons>
          <IonTitle>{username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="content">
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
                logout()
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default withRouter(memo(Profile))
