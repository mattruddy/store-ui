import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
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
import { ellipse, square, triangle } from 'ionicons/icons';
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

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LogIn from './pages/LogIn';
import { setIsLoggedIn, setToken, loadUserData } from './data/user/user.actions';
import { connect } from './data/connect';
import { AppContextProvider } from './data/AppContext';
import PWA from './pages/PWA';

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
  setIsLoggedIn: typeof setIsLoggedIn;
  setToken: typeof setToken;
}

interface IonicAppProps extends StateProps, DispatchProps { }

const IonicApp: React.FC<IonicAppProps> = ({
  token,
  isLoggedIn,
  loadUserData,
  setToken,
  setIsLoggedIn
}) => {

  useEffect(() => {
    loadUserData();
  }, [])

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn, token])

  return (
    <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/pwas" component={PWAS} exact={true} />
          <Route path="/pwa/:id" component={PWA} />
          <Route path="/explore" component={Tab2} exact={true} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={LogIn} />
          <Route path="/logout" render={() => {
              setIsLoggedIn(false);
              setToken(undefined);
              return <Redirect to="/login" />
          }} />
          <Route path="/profile" component={Profile} />
          <Route path="/" render={() => <Redirect to="/pwas" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="pwas" href="/pwas">
            <IonIcon icon={triangle} />
            <IonLabel>PWAs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="explore" href="/explore" hidden={true}>
            <IonIcon icon={ellipse} />
            <IonLabel>Explore</IonLabel>
          </IonTabButton>
          <IonTabButton tab="login" href="/login" disabled={isLoggedIn} hidden={isLoggedIn}>
            <IonIcon icon={square} />
            <IonLabel>Log In</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile" disabled={!isLoggedIn} hidden={!isLoggedIn}>
            <IonIcon icon={square} />
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
    setIsLoggedIn, 
    setToken, 
    loadUserData,
  },
  component: IonicApp
});
