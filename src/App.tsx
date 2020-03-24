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
import { ellipse, square, triangle, person, home, logIn, navigate } from 'ionicons/icons';
import PWAS from './pages/PWAs';
import SignUp from './pages/SignUp';
import Tab2 from './pages/Tab2';
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
        <IonRouterOutlet>
          <Route path="/pwa/:id" component={PWA} />
          <Route path="/explore" component={Tab2} exact={true} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={LogIn} />
          <Route path="/profile" component={Profile} />
          <Route path="/mypwa/:id" component={MyPWA} />
          <Route path="/pwas" component={PWAS} exact />
          <Route path="/" render={() => <Redirect to="/pwas" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="pwas" href="/pwas">
            <IonIcon icon={home} />
            <IonLabel>PWAs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="explore" href="/explore" hidden={true}>
            <IonIcon icon={ellipse} />
            <IonLabel>Explore</IonLabel>
          </IonTabButton>
          <IonTabButton tab="login" href="/login" disabled={isLoggedIn} hidden={isLoggedIn}>
            <IonIcon icon={logIn} />
            <IonLabel>Log In</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile" disabled={!isLoggedIn} hidden={!isLoggedIn}>
            <IonIcon icon={person} />
            <IonLabel>Profile</IonLabel>
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
