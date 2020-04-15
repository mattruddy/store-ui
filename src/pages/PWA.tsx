import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter, useIonViewDidLeave, IonBackButton, IonButtons, IonToast, IonList } from '@ionic/react';
import { getPWA } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import { PWA as PWAType } from '../util/types';
import { connect } from '../data/connect';
import { setHasReadInstall } from '../data/user/user.actions';
import ScreenshotSlider from '../components/ScreenshotSlider';
import Rating from '../components/Rating';
import PWAInfo from '../components/PWAInfo';
import RatingList from '../components/RatingList';

interface MatchParams {
  id: string | undefined;
}

interface OwnProps extends RouteComponentProps<MatchParams> { };

interface StateProps {
  hasRead?: string;
};

interface DispatchProps {
  setHasReadInstall: typeof setHasReadInstall
}

type PWAProps = OwnProps & StateProps & DispatchProps;

const PWA: React.FC<PWAProps> = ({
  match,
  history,
  hasRead,
  setHasReadInstall,
}) => {

  const [pwa, setPwa] = useState<PWAType | undefined>(undefined);

  useIonViewDidEnter(() => {
    loadPWA(history.location.pathname.split('/')[2]);
  }, [])

  useIonViewDidLeave(() => {
    setPwa(undefined);
  }, [])

  const loadPWA = async (id: string) => {
    const resp = await getPWA(Number(id)) as PWAType;
    setPwa(resp);
  }

  return (
    <IonPage>
      {
        pwa &&
        <>
        <IonHeader>
          <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/pwas' />
          </IonButtons>
          {<IonTitle>{pwa.name}</IonTitle> }
          </IonToolbar>
        </IonHeader>
        <IonContent class='content'>
          {<PWAInfo pwa={pwa} appId={Number(match.params.id!)} />}
          {<h2 style={{ paddingLeft: '10px' }}>Screenshots</h2> }
          {pwa.screenshots && <ScreenshotSlider screenshots={pwa.screenshots}></ScreenshotSlider>}
          {<h2 style={{ paddingLeft: '10px' }}>Ratings</h2> }
          {<Rating appId={Number(match.params.id!)} />}
          <IonList>
            {pwa.ratings && pwa.ratings.map((rating, idx) =>
                <RatingList key={idx} rating={rating} /> 
            )}
          </IonList>
        </IonContent>
        <IonToast
          isOpen={(hasRead !== undefined && hasRead === 'false')}
          position='top'
          message='Please click to learn how to install a PWA'
          buttons={[
            {
              text: 'Close',
              handler: () => {
                setHasReadInstall('true');
              }
          }, {
              text: 'Learn',
              handler: () => {
                setHasReadInstall('true');
                history.push('/about');
              }
          }]}
        />
      </>
    }
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    hasRead: state.user.hasRead
  }),
  mapDispatchToProps: {
    setHasReadInstall
  },
  component: withRouter(PWA)
})