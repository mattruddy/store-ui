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
} from "ionicons/icons"
import ProfileCard, { TotalAppData } from "../../components/ProfileCard"
import { useInView } from "react-intersection-observer"
import DevContentCard from "../../components/DevContentCard"
const Profile: React.FC = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [hideApproved, setHideApproved] = useState<boolean>(false)
  const [hidePending, setHidePending] = useState<boolean>(false)
  const [hideDenied, setHideDenied] = useState<boolean>(false)
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

  const filterPwa = (filter: string) => {
    const filteredPwas = pwas && pwas.filter((pwa) => pwa.status === filter)
    return filteredPwas.length > 0 ? (
      filteredPwas.map((pwa, idx) => (
        <IonCol key={idx} size="6" sizeLg="4">
          <PWACard url="/mypwa" pwa={pwa} isMyPwa={true} />
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
          <DevContentCard
            title="Approved"
            isHidden={hideApproved}
            onClick={() => setHideApproved(!hideApproved)}
          >
            <IonRow>{filterPwa("APPROVED")}</IonRow>
          </DevContentCard>
          <DevContentCard
            title="Pending"
            isHidden={hidePending}
            onClick={() => setHidePending(!hidePending)}
          >
            <IonRow>{filterPwa("PENDING")}</IonRow>
          </DevContentCard>
          <DevContentCard
            title="Denied"
            isHidden={hideDenied}
            onClick={() => setHideDenied(!hideDenied)}
          >
            <IonRow>{filterPwa("DENIED")}</IonRow>
          </DevContentCard>
          <DevContentCard
            title="Starred"
            isHidden={hideStar}
            onClick={() => setHideStar(!hideStar)}
          >
            <IonRow>
              {starredApps.map((app, idx) => (
                <IonCol key={idx} size="6" sizeLg="4">
                  <PWACard pwa={app} url="/pwa" isMyPwa={false} />
                </IonCol>
              ))}
            </IonRow>
          </DevContentCard>
        </Fragment>
      ),
    [pwas, starredApps, hideApproved, hidePending, hideDenied, hideStar]
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
            <IonCol size="12">{renderAppsSections}</IonCol>
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
