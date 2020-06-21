import React, { useEffect, useCallback } from "react"
import { Redirect, Route } from "react-router-dom"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToast,
  getPlatforms,
  IonSplitPane,
  IonBadge,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import {
  person,
  home,
  logIn,
  informationCircle,
  search,
  notifications,
  alert,
} from "ionicons/icons"
import {
  PWAs,
  SignUp,
  Support,
  Profile,
  Login,
  PWA,
  MyPWA,
  About,
  AdminPwas,
  AdminNotify,
  Categories,
} from "./pages"
import { RouteMap } from "./routes"
import ReactGA from "react-ga"
import Home from "./pages/Home"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import {
  thunkLoadUserData,
  thunkLoadProfile,
  thunkSetDarkMode,
  thunkLoadNotifications,
} from "./redux/User/actions"
import { SetWindow } from "./redux/Window/actions"
import { ReduxCombinedState } from "./redux/RootReducer"
import { clearAlerts } from "./redux/Alerts/actions"
import { Axios } from "./redux/Actions"
import { SideBar } from "./components"
import Search from "./pages/Search"
import Settings from "./pages/Settings"
import Developer from "./pages/Developer"
import AddPWA from "./pages/AddPWA"
import Notifications from "./pages/Notifications"

const App: React.FC = () => {
  return <IonicApp />
}

const IonicApp: React.FC = () => {
  const dispatch = useDispatch()
  const loadUserData = useCallback(() => dispatch(thunkLoadUserData()), [
    dispatch,
  ])
  const loadProfile = useCallback(() => dispatch(thunkLoadProfile()), [
    dispatch,
  ])
  const clearAlert = useCallback(() => dispatch(clearAlerts()), [dispatch])

  const setDarkMode = useCallback(
    (prefersDarkMode: boolean) => dispatch(thunkSetDarkMode(prefersDarkMode)),
    [dispatch]
  )
  const loadNotifications = useCallback(
    () => dispatch(thunkLoadNotifications()),
    [dispatch]
  )

  const handleResize = useCallback(() => dispatch(SetWindow()), [dispatch])

  const {
    isLoggedIn,
    token,
    alerts,
    push,
    darkMode,
    lastNotId,
    notifys,
  } = useSelector(
    ({
      user: { isLoggedIn, token, push, darkMode, lastNotId, notifications },
      alerts,
    }: ReduxCombinedState) => ({
      isLoggedIn,
      token,
      alerts,
      push,
      darkMode,
      lastNotId,
      notifys: notifications,
    }),
    shallowEqual
  )

  const handleTheme = (): void => {
    const prefersDarkMode: MediaQueryList = window.matchMedia(
      "(prefers-color-scheme: dark)"
    )
    setDarkMode(prefersDarkMode.matches)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    loadUserData()
    loadNotifications()
    //handleTheme()
  }, [])

  useEffect(() => {
    if (isLoggedIn && token) {
      loadProfile()
    }
  }, [isLoggedIn, token])

  useEffect(() => {
    ;(async () => {
      if (isLoggedIn && token && push) {
        let deviceType
        const platforms = getPlatforms()
        if (platforms.includes("ios")) {
          deviceType = "IOS"
        } else if (platforms.includes("android")) {
          deviceType = "ANDROID"
        } else {
          deviceType = "DESKTOP"
        }
        const data = {
          auth: push.auth,
          key: push.key,
          endPoint: push.endpoint,
          deviceType: deviceType,
        }
        await (await Axios()).post(`secure/device/add`, data)
      }
    })()
  }, [isLoggedIn, token, push])

  useEffect(() => {
    ReactGA.initialize("UA-165324521-1")
  }, [])

  return (
    <IonApp className={`${darkMode ? "dark-theme" : ""}`}>
      <IonReactRouter>
        <IonSplitPane contentId="main" when="md">
          <SideBar />
          <div id="main">
            <IonTabs>
              <IonRouterOutlet animated={false}>
                <Route
                  path={[RouteMap.PWA_DETAIL]}
                  component={PWA}
                  exact={false}
                />
                <Route
                  path={[RouteMap.SUPPORT]}
                  component={Support}
                  exact={true}
                />
                <Route path={RouteMap.SIGNUP} component={SignUp} />
                <Route path={RouteMap.LOGIN} component={Login} />
                <Route path={RouteMap.PROFILE} component={Profile} />
                <Route path={RouteMap.MY_PWA_DETAIL} component={MyPWA} />
                <Route path={RouteMap.ABOUT} component={About} />
                <Route path={RouteMap.ADMIN_PWAS} component={AdminPwas} exact />
                <Route
                  path={RouteMap.ADMIN_NOTIFY}
                  component={AdminNotify}
                  exact
                />
                <Route
                  path={RouteMap.CATEGORIES}
                  component={Categories}
                  exact
                />
                <Route path={RouteMap.PWAS} component={PWAs} exact />
                <Route path={RouteMap.HOME} component={Home} />
                <Route path={RouteMap.SEARCH} component={Search} />
                <Route path={RouteMap.SETTINGS} component={Settings} />
                <Route path={RouteMap.DEVELOPER} component={Developer} />
                <Route path={RouteMap.ADD} component={AddPWA} />
                <Route
                  path={RouteMap.NOTIFICATIONS}
                  component={Notifications}
                />
                <Route
                  path={RouteMap.ADMIN_ROOT}
                  render={() => <Redirect to={RouteMap.ADMIN_PWAS} />}
                  exact={true}
                />
                <Route
                  path={RouteMap.ROOT}
                  render={() => <Redirect to={RouteMap.HOME} />}
                  exact={true}
                />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton className="tab" tab="pwas" href={RouteMap.HOME}>
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton
                  className="CatTabButton"
                  tab="categories"
                  href={RouteMap.CATEGORIES}
                >
                  <IonIcon icon={search} />
                  <IonLabel>Search</IonLabel>
                </IonTabButton>
                <IonTabButton
                  className="tab"
                  tab="notifications"
                  href={RouteMap.NOTIFICATIONS}
                >
                  {notifys.length > 0 && lastNotId < notifys[0].id && (
                    <IonBadge color="danger">
                      <IonIcon icon={alert} />
                    </IonBadge>
                  )}
                  <IonIcon icon={notifications} />
                  <IonLabel>Notifications</IonLabel>
                </IonTabButton>
                <IonTabButton
                  className="tab"
                  tab="login"
                  href={RouteMap.LOGIN}
                  disabled={isLoggedIn}
                  hidden={isLoggedIn}
                >
                  <IonIcon icon={logIn} />
                  <IonLabel>Log In</IonLabel>
                </IonTabButton>
                <IonTabButton
                  className="tab"
                  tab="profile"
                  href={RouteMap.PROFILE}
                  disabled={!isLoggedIn}
                  hidden={!isLoggedIn}
                >
                  <IonIcon icon={person} />
                  <IonLabel>Profile</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </div>
        </IonSplitPane>
        <IonToast
          isOpen={alerts.show}
          message={alerts.message}
          duration={alerts.timeout}
          onDidDismiss={clearAlert}
          buttons={[
            {
              side: "end",
              text: "Dismiss",
              handler: () => {
                clearAlert()
              },
            },
          ]}
        />
      </IonReactRouter>
    </IonApp>
  )
}

export default App
