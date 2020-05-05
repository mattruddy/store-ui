import React, { useEffect, useState } from "react"
import { Redirect, Route } from "react-router-dom"
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import { person, home, logIn, bandage, informationCircle } from "ionicons/icons"
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
} from "./pages"
import { loadUserData } from "./data/user/user.actions"
import { connect } from "./data/connect"
import { AppContextProvider } from "./data/AppContext"
import ReactGA from "react-ga"

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  )
}

interface StateProps {
  token?: string
  isLoggedIn: boolean
}

interface DispatchProps {
  loadUserData: typeof loadUserData
}

interface IonicAppProps extends StateProps, DispatchProps {}

const IonicApp: React.FC<IonicAppProps> = ({
  token,
  isLoggedIn,
  loadUserData,
}) => {
  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    ReactGA.initialize("UA-165324521-1")
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet animated={false}>
            <Route path="/pwa/:pwaName" component={PWA} exact={false} />
            <Route path="/support" component={Support} exact={true} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/profile" component={Profile} />
            <Route path="/mypwa/:id" component={MyPWA} />
            <Route path="/pwas" component={PWAs} exact />
            <Route path="/about" component={About} />
            <Route path="/admin" component={Admin} exact />
            <Route
              path="/"
              render={() => <Redirect to="/pwas" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton class="tab" tab="pwas" href="/pwas">
              <IonIcon icon={home} />
              <IonLabel>PWAs</IonLabel>
            </IonTabButton>
            <IonTabButton class="tab" tab="about" href="/about">
              <IonIcon icon={informationCircle} />
              <IonLabel>About</IonLabel>
            </IonTabButton>
            <IonTabButton
              class="tab"
              tab="support"
              href="/support"
              hidden={!isLoggedIn}
            >
              <IonIcon icon={bandage} />
              <IonLabel>Support</IonLabel>
            </IonTabButton>
            <IonTabButton
              class="tab"
              tab="login"
              href="/login"
              disabled={isLoggedIn}
              hidden={isLoggedIn}
            >
              <IonIcon icon={logIn} />
              <IonLabel>Log In</IonLabel>
            </IonTabButton>
            <IonTabButton
              class="tab"
              tab="profile"
              href="/profile"
              disabled={!isLoggedIn}
              hidden={!isLoggedIn}
            >
              <IonIcon icon={person} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    token: state.user.token,
    isLoggedIn: state.user.isLoggedIn,
  }),
  mapDispatchToProps: {
    loadUserData,
  },
  component: IonicApp,
})
