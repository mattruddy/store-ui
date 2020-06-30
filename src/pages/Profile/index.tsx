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
  IonGrid,
} from "@ionic/react"
import { useHistory } from "react-router"
import { PWACard } from "../../components"
import { RouteMap } from "../../routes"
import { ReduxCombinedState } from "../../redux/RootReducer"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { thunkLogout } from "../../redux/User/actions"
import "./styles.css"
import Popover from "../../components/Popover"
import {
  logOut,
  peopleOutline,
  addCircleOutline,
  settingsOutline,
  ellipsisVertical,
  personOutline,
  starOutline,
} from "ionicons/icons"
import ProfileCard, { TotalAppData } from "../../components/ProfileCard"
import { useInView } from "react-intersection-observer"
import DevContentCard from "../../components/DevContentCard"
import { PWA } from "../../util/types"
const Profile: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [hideApps, setHideApps] = useState<boolean>(false)
  const [hideStar, setHideStar] = useState<boolean>(false)
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
    starredApps,
  } = useSelector(
    ({
      user: {
        pwas,
        username,
        loading,
        isLoggedIn,
        profile,
        email,
        starredApps,
      },
    }: ReduxCombinedState) => ({
      pwas: pwas,
      username: username,
      isLoading: loading,
      isLoggedIn: isLoggedIn,
      profile: profile,
      email: email,
      starredApps: starredApps,
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

  const loadApps = (apps: PWA[], url: string) => {
    return apps.length > 0 ? (
      apps.map((app, idx) => (
        <IonCol key={idx} size="6" sizeLg="4">
          <PWACard url={url} pwa={app} isMyPwa={true} height={90} />
        </IonCol>
      ))
    ) : (
      <IonCol>
        <small className="NoAppsNote">No apps yet</small>
      </IonCol>
    )
  }

  const renderAppsSections: JSX.Element = useMemo(
    () =>
      pwas && (
        <Fragment>
          <DevContentCard
            title="My Apps"
            isHidden={hideApps}
            onClick={() => setHideApps(!hideApps)}
          >
            <IonRow>{loadApps(pwas, "/mypwa")}</IonRow>
          </DevContentCard>
        </Fragment>
      ),
    [pwas, hideApps]
  )

  const renderStarredAppsSection = useMemo(() => {
    return (
      <DevContentCard
        icon={starOutline}
        count={starredApps.length}
        isHidden={hideStar}
        onClick={() => setHideStar(!hideStar)}
      >
        <IonRow>{loadApps(starredApps, "/pwa")}</IonRow>
      </DevContentCard>
    )
  }, [starredApps, hideStar])

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
                  name: "Add App",
                  action: () => history.push(RouteMap.ADD),
                  icon: addCircleOutline,
                },
                {
                  name: "Edit Profile",
                  action: () => history.push(RouteMap.SETTINGS),
                  icon: settingsOutline,
                },
                {
                  name: "Public Profile",
                  action: () =>
                    history.push(
                      `${RouteMap.DEVELOPER.replace(":username", username)}`
                    ),
                  icon: personOutline,
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
        <IonGrid>
          <IonRow>
            <IonCol ref={ref} className="ProfileCardCol" size="12">
              <ProfileCard
                isMyProfile={true}
                data={totalData}
                avatar={profile?.avatar}
                gitHub={profile?.gitHub}
                header={profile?.header}
                fullName={profile?.fullName}
                location={profile?.location}
                email={email}
                occupationStatus={profile?.occupationStatus}
                username={username}
                isLoading={isLoading}
              />
            </IonCol>
            <IonCol size="12">
              {renderAppsSections}
              {renderStarredAppsSection}
            </IonCol>
          </IonRow>
        </IonGrid>
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
