import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect, IonCard, IonCardHeader, IonCardContent, IonButton, IonImg, IonSlides, IonSlide, IonLabel, useIonViewDidEnter, useIonViewWillEnter, IonProgressBar, useIonViewDidLeave, IonBackButton, IonButtons, IonToast } from '@ionic/react';
import { getPWA, postScore } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import { PWA as PWAType } from '../util/types';
import { connect } from '../data/connect';
import { setHasReadInstall } from '../data/user/user.actions';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              { pwa && 
                <img style={{height: '70px', width: '70px', borderRadius: '5px', margin: '10px'}} src={pwa.icon} /> }
              { pwa && 
                <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '70px'}}>
                  <p style={{ margin: '0', fontSize: '20px'}}>{pwa.name}</p>
                  <small>{pwa.category}</small>
                </div>}
            </div>
            {pwa && <IonButton class='button' style={{ marginRight: '10px'}} onClick={() => {
              postScore(Number(match.params.id!));
              window.open(pwa.link, "_blank");
            }}>Install</IonButton>}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent class='content'>
        { !isLoading && <h2 style={{paddingTop: '10px', paddingLeft: '10px'}}>About</h2> }
        <div style={{height: '200px', padding: '15px'}}>
        {pwa && pwa.description}
        </div> 
        { !isLoading && <h2 style={{ paddingLeft: '10px' }}>Screenshots</h2> }
        {
          pwa && pwa.screenshots &&
          <IonSlides style={{ marginBottom: '45px'}} key={pwa.screenshots.map((shot) => shot.imageId).join('_')} pager={true} options={{ initialSlide: 0, speed: 400}}>
          {pwa.screenshots.map((shot, idx) => (
            <IonSlide key={idx}>
              <img style={{height: '400px', width: '200px'}} src={shot.url} /> 
            </IonSlide>
          ))}
        </IonSlides>
        }
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
            handler: async () => {
              await setHasReadInstall('true');
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