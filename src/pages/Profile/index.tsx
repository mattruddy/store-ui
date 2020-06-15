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
  IonRow,
  IonButtons,
  IonAlert,
  IonCol,
  IonProgressBar,
  IonList,
  IonItem,
  IonListHeader,
  IonIcon,
  IonGrid,
  IonButton,
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWACard } from "../../components"
import { RouteMap } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkLogout, thunkAddPWA } from "../../redux/User/actions"
import SumbitAppModal from "../../components/SumbitAppModal"
import "./styles.css"
import Popover from "../../components/Popover"
import {
  logOut,
  menu,
  peopleOutline,
  addCircleOutline,
  settingsOutline,
  logoGithub,
  logoLinkedin,
  logoTwitter,
} from "ionicons/icons"

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const history = useHistory()

  const {
    pwas,
    username,
    isLoading,
    isLoggedIn,
    status,
    profile,
  } = useSelector(
    ({
      user: { pwas, username, loading, isLoggedIn, profile },
      alerts: { status },
    }: ReduxCombinedState) => ({
      pwas: pwas,
      username: username,
      isLoading: loading,
      isLoggedIn: isLoggedIn,
      status: status,
      profile: profile,
    }),
    shallowEqual
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
    if (status === "success") {
      setShowModal(false)
    }
  }, [status])

  const filterPwa = (filter: string) => {
    const filteredPwas = pwas && pwas.filter((pwa) => pwa.status === filter)
    return filteredPwas.length > 0 ? (
      filteredPwas.map((pwa, idx) => (
        <IonCol key={idx} size="6" sizeMd="4" sizeLg="3">
          <PWACard url="/mypwa" pwa={pwa} />
          {filter === "DENIED" && (
            <Fragment>
              <span style={{ paddingLeft: "15px" }}>
                <strong>Reason</strong>
              </span>
              <p style={{ padding: "15px" }}>{pwa.reason}</p>
            </Fragment>
          )}
        </IonCol>
      ))
    ) : (
      <IonCol>
        <small className="NoAppsNote">{`No ${filter.toLowerCase()} apps yet`}</small>
      </IonCol>
    )
  }

  const renderAppsSections: JSX.Element = useMemo(
    () =>
      pwas && (
        <IonCol>
          <IonTitle>Approved</IonTitle>
          <IonRow>{filterPwa("APPROVED")}</IonRow>
          <IonTitle>Pending</IonTitle>
          <IonRow>{filterPwa("PENDING")}</IonRow>
          <IonTitle>Denied</IonTitle>
          <IonRow>{filterPwa("DENIED")}</IonRow>
        </IonCol>
      ),
    [pwas]
  )

  return (
    <IonPage>
      <SumbitAppModal
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
        onSubmit={addApp}
      />
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>{username}</IonTitle>
          <IonButtons slot="end">
            <Popover
              showPopover={showPopover}
              setShowPopover={setShowPopover}
              icon={menu}
              items={[
                {
                  name: "Add PWA",
                  action: () => setShowModal(true),
                  icon: addCircleOutline,
                },
                {
                  name: "Settings",
                  action: () => history.push(RouteMap.SETTINGS),
                  icon: settingsOutline,
                },
                {
                  name: "Support",
                  action: () => history.push(RouteMap.SUPPORT),
                  icon: peopleOutline,
                },
                {
                  name: "Log out",
                  action: () => setShowAlert(true),
                  icon: logOut,
                },
              ]}
            />
          </IonButtons>
        </IonToolbar>
        {isLoading && <IonProgressBar type="indeterminate" color="primary" />}
      </IonHeader>
      <IonContent class="content">
        <IonRow className="ProfileTopRow bottom-line-border">
          <div>
            <img
              alt="avatar"
              className="icon"
              src={profile?.avatar ? profile.avatar : "assets/icon/logo.png"}
            />
            <a
              className="ion-color-github"
              href={profile?.gitHub}
              target="_blank"
            >
              <IonIcon size="large" icon={logoGithub} />
            </a>
            <a
              className="ion-color-linkedin"
              href={profile?.linkedIn}
              target="_blank"
            >
              <IonIcon color="gitHub" size="large" icon={logoLinkedin} />
            </a>
            <a
              className="ion-color-twitter"
              href={profile?.twitter}
              target="_blank"
            >
              <IonIcon color="gitHub" size="large" icon={logoTwitter} />
            </a>
          </div>
          <div>
            <IonButton
              onClick={() => history.push(RouteMap.SETTINGS)}
              fill="outline"
            >
              Edit Profile
            </IonButton>
          </div>
        </IonRow>
        <IonRow>{renderAppsSections}</IonRow>
      </IonContent>
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
    </IonPage>
  )
}

export default memo(Profile)
