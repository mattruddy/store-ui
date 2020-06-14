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
} from "ionicons/icons"

const Profile: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
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
        <IonCol key={idx} size="8" sizeMd="8" sizeLg="4">
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
      !isLoading && pwas ? (
        <Fragment>
          <h2 style={{ marginLeft: "20px" }}>Approved</h2>
          <IonRow>{filterPwa("APPROVED")}</IonRow>
          <h2 style={{ marginLeft: "20px" }}>Pending</h2>
          <IonRow>{filterPwa("PENDING")}</IonRow>
          <h2 style={{ marginLeft: "20px" }}>Denied</h2>
          <IonRow>{filterPwa("DENIED")}</IonRow>
        </Fragment>
      ) : (
        <IonProgressBar type="indeterminate" />
      ),
    [pwas, isLoading]
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
      </IonHeader>
      <IonContent class="content">
        <IonRow>
          <IonCol className="ProfileAboutCol" size="4">
            <img
              alt="avatar"
              style={{ height: "150px", width: "150px" }}
              src="assets/icon/logo.png"
            />
            <IonList style={{ background: "inherit" }}>
              <IonListHeader>
                <IonTitle>About</IonTitle>
              </IonListHeader>
              <IonItem>Github</IonItem>
              <IonItem>LinkedIn</IonItem>
              <IonItem>Twitter</IonItem>
            </IonList>
          </IonCol>
          <IonCol>{renderAppsSections}</IonCol>
        </IonRow>
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
