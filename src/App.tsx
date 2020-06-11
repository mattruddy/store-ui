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
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { person, home, logIn, informationCircle, search } from "ionicons/icons"
import {
  PWAs,
  SignUp,
  Support,
  Profile,
  Login,
  PWA,
  MyPWA,
  About,
  Admin,
  Categories,
} from "./pages"
import { RouteMap } from "./routes"
import ReactGA from "react-ga"
import Home from "./pages/Home"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import { thunkLoadUserData, thunkLoadProfile } from "./redux/User/actions"
import { SetWindow } from "./redux/Window/actions"
import { ReduxCombinedState } from "./redux/RootReducer"
import { clearAlerts } from "./redux/Alerts/actions"
import { Axios } from "./redux/Actions"
import { SideBar } from "./components"
import Search from "./pages/Search"

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

  const handleResize = useCallback(() => dispatch(SetWindow()), [dispatch])

  const { isLoggedIn, token, alerts, push } = useSelector(
    ({ user: { isLoggedIn, token, push }, alerts }: ReduxCombinedState) => ({
      isLoggedIn: isLoggedIn,
      token: token,
      alerts: alerts,
      push: push,
    }),
    shallowEqual
  )

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    loadUserData()
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
    <IonApp>
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
                <Route path={RouteMap.ADMIN} component={Admin} exact />
                <Route
                  path={RouteMap.CATEGORIES}
                  component={Categories}
                  exact
                />
                <Route path={RouteMap.PWAS} component={PWAs} exact />
                <Route path={RouteMap.HOME} component={Home} />
                <Route path={RouteMap.SEARCH} component={Search} />
                <Route
                  path={RouteMap.ROOT}
                  render={() => <Redirect to={RouteMap.HOME} />}
                  exact={true}
                />
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton className="tab" tab="home" href={RouteMap.HOME}>
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
                <IonTabButton className="tab" tab="about" href={RouteMap.ABOUT}>
                  <IonIcon icon={informationCircle} />
                  <IonLabel>About</IonLabel>
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
