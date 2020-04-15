import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect, IonCard, IonCardHeader, IonCardContent, IonButton, IonImg, IonSlides, IonSlide, IonLabel, useIonViewDidEnter, useIonViewWillEnter, IonProgressBar, useIonViewDidLeave, IonBackButton, IonButtons, IonToast } from '@ionic/react';
import { getPWA, postScore } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import { PWA as PWAType } from '../util/types';
import { connect } from '../data/connect';
import { setHasReadInstall } from '../data/user/user.actions';
import ScreenshotSlider from '../components/ScreenshotSlider';
import Rating from '../components/Rating';
import PWAInfo from '../components/PWAInfo';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    setIsLoading(true);
  }, [])

  useIonViewDidEnter(() => {
    loadPWA(history.location.pathname.split('/')[2]);
    setIsLoading(false);
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
      <IonHeader>
        <IonToolbar>
        <IonButtons slot='start'>
          <IonBackButton defaultHref='/pwas' />
        </IonButtons>
        { pwa && <IonTitle>{pwa.name}</IonTitle> }
        </IonToolbar>
      </IonHeader>
      <IonContent class='content'>
        {pwa && <PWAInfo pwa={pwa} isLoading={isLoading} appId={Number(match.params.id!)} />}
        { !isLoading && <h2 style={{ paddingLeft: '10px' }}>Screenshots</h2> }
        {pwa && pwa.screenshots && <ScreenshotSlider screenshots={pwa.screenshots}></ScreenshotSlider>}
        { !isLoading && <h2 style={{ paddingLeft: '10px' }}>Ratings</h2> }
        {<Rating appId={Number(match.params.id!)} />}
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