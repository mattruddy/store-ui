import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, home, logIn, bandage, informationCircle } from 'ionicons/icons';
import PWAS from './pages/PWAs';
import SignUp from './pages/SignUp';
import Support from './pages/Support';
import Profile from './pages/Profile';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import './theme/variables.css';
import LogIn from './pages/LogIn';
import { loadUserData } from './data/user/user.actions';
import { connect } from './data/connect';
import { AppContextProvider } from './data/AppContext';
import PWA from './pages/PWA';
import MyPWA from './pages/MyPWA';
import About from './pages/About';
import './App.css';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  token?: string,
  isLoggedIn: boolean,
}

interface DispatchProps {
  loadUserData: typeof loadUserData;
}

interface IonicAppProps extends StateProps, DispatchProps { }

const IonicApp: React.FC<IonicAppProps> = ({
  token,
  isLoggedIn,
  loadUserData
}) => {

  useEffect(() => {
    loadUserData();
  }, [])

  return (
    <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet animated={false} >
          <Route path="/pwa/:id" component={PWA} exact={false} />
          <Route path="/support" component={Support} exact={true} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={LogIn} />
          <Route path="/profile" component={Profile} />
          <Route path="/mypwa/:id" component={MyPWA} />
          <Route path="/pwas" component={PWAS} exact />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} exact />
          <Route path="/" render={() => <Redirect to="/pwas" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom" color='primary'>
          <IonTabButton class='tab' tab="pwas" href="/pwas">
            <IonIcon icon={home} />
            <IonLabel >PWAs</IonLabel>
          </IonTabButton>
          <IonTabButton class='tab' tab="about" href="/about">
            <IonIcon icon={informationCircle} />
            <IonLabel >About</IonLabel>
          </IonTabButton>
          <IonTabButton class='tab' tab="support" href="/support" hidden={!isLoggedIn}>
            <IonIcon  icon={bandage} />
            <IonLabel >Support</IonLabel>
          </IonTabButton>
          <IonTabButton class='tab' tab="login" href="/login" disabled={isLoggedIn} hidden={isLoggedIn}>
            <IonIcon icon={logIn} />
            <IonLabel >Log In</IonLabel>
          </IonTabButton>
          <IonTabButton class='tab' tab="profile" href="/profile" disabled={!isLoggedIn} hidden={!isLoggedIn}>
            <IonIcon icon={person} />
            <IonLabel >Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    token: state.user.token,
    isLoggedIn: state.user.isLoggedIn
  }),
  mapDispatchToProps: { 
    loadUserData,
  },
  component: IonicApp
});
