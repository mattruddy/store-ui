import React from 'react';
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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/pwas" component={PWAS} exact={true} />
          <Route path="/explore" component={Tab2} exact={true} />
          <Route path="/signup" component={SignUp} />
          <Route path="/" render={() => <Redirect to="/pwas" />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="pwas" href="/pwas">
            <IonIcon icon={triangle} />
            <IonLabel>PWAs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="explore" href="/explore">
            <IonIcon icon={ellipse} />
            <IonLabel>Explore</IonLabel>
          </IonTabButton>
          <IonTabButton tab="signup" href="/signup">
            <IonIcon icon={square} />
            <IonLabel>Log In</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
