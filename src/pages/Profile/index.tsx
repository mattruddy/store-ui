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
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWACard } from "../../components"
import { RouteMap } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkLogout, thunkAddPWA } from "../../redux/User/actions"
import "./styles.css"
import Popover from "../../components/Popover"
import {
  logOut,
  peopleOutline,
  addCircleOutline,
  settingsOutline,
  ellipsisVertical,
} from "ionicons/icons"
import ProfileCard, { TotalAppData } from "../../components/ProfileCard"
import { useInView } from "react-intersection-observer"
const Profile: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [ref, inView] = useInView()
  const history = useHistory()

  const {
    pwas,
    username,
    isLoading,
    isLoggedIn,
    profile,
    email,
    totalData,
  } = useSelector(
    ({
      user: { pwas, username, loading, isLoggedIn, profile, email },
    }: ReduxCombinedState) => ({
      pwas: pwas,
      username: username,
      isLoading: loading,
      isLoggedIn: isLoggedIn,
      profile: profile,
      email: email,
      totalData: pwas.reduce<TotalAppData>(
        (tot, currentPwa) => ({
          totalInstalls: tot.totalInstalls + currentPwa.installs,
          totalPageViews: tot.totalPageViews + currentPwa.pageViews,
        }),
        { totalInstalls: 0, totalPageViews: 0 }
      ),
    }),
    shallowEqual
  )

  const dispatch = useDispatch()
  const logout = useCallback(() => dispatch(thunkLogout()), [dispatch])

  useEffect(() => {
    if (!isLoggedIn) {
      history.push(RouteMap.LOGIN)
    }
  }, [isLoggedIn])

  const filterPwa = (filter: string) => {
    const filteredPwas = pwas && pwas.filter((pwa) => pwa.status === filter)
    return filteredPwas.length > 0 ? (
      filteredPwas.map((pwa, idx) => (
        <IonCol key={idx} size="6" sizeLg="4">
          <PWACard url="/mypwa" pwa={pwa} />
          {filter === "DENIED" && (
            <Fragment>
              <span>
                <strong>Reason</strong>
              </span>
              <p>{pwa.reason}</p>
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
        <Fragment>
          <h2 style={{ marginLeft: "32px" }}>Approved</h2>
          <IonRow>{filterPwa("APPROVED")}</IonRow>
          <h2 style={{ marginLeft: "32px" }}>Pending</h2>
          <IonRow>{filterPwa("PENDING")}</IonRow>
          <h2 style={{ marginLeft: "32px" }}>Denied</h2>
          <IonRow>{filterPwa("DENIED")}</IonRow>
        </Fragment>
      ),
    [pwas]
  )

  return (
    <IonPage>
      <IonHeader className="ion-no-border bottom-line-border">
        <IonToolbar>
          <IonTitle>{inView ? "Profile" : username}</IonTitle>
          <IonButtons slot="end">
            <Popover
              showPopover={showPopover}
              setShowPopover={setShowPopover}
              icon={ellipsisVertical}
              items={[
                {
                  name: "Add PWA",
                  action: () => history.push(RouteMap.ADD),
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
        <IonRow>
          <IonCol ref={ref} className="ProfileCardCol" size="12">
            <ProfileCard
              isMyProfile={true}
              data={totalData}
              avatar={profile?.avatar}
              gitHub={profile?.gitHub}
              twitter={profile?.twitter}
              linkedIn={profile?.linkedIn}
              email={email}
              username={username}
              isLoading={isLoading}
            />
          </IonCol>
          <IonCol size="12">{renderAppsSections}</IonCol>
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
