import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonModal, IonList, IonInput, IonTextarea, IonText, IonImg, IonGrid, IonRow, IonIcon, IonButtons, IonFab, IonFabButton, IonFabList, IonAlert, useIonViewDidEnter, IonCol, useIonViewWillLeave, IonToast, IonProgressBar, IonSpinner } from '@ionic/react';
import { getProfile, postApp, getLighthouseReport } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import ImageUploader from 'react-images-upload';
import { connect } from '../data/connect';
import CategoryOptions from '../components/CategoryOptions';
import { UserProfile, PWA } from '../util/types';
import PWACard from '../components/PWACard';
import { add, menu, logOut, contractSharp } from 'ionicons/icons';
import { setToken, setIsLoggedIn } from '../data/user/user.actions';
//@ts-ignore
import ReportViewer from 'react-lighthouse-viewer';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setToken: typeof setToken
  setIsLoggedIn: typeof setIsLoggedIn
}

interface StateProps {}

interface ProfileProps extends OwnProps,  DispatchProps, StateProps {}

const Profile: React.FC<ProfileProps> = ({
  history,
  setToken,
  setIsLoggedIn
}) => {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
  const [url, setUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [desc, setDesc] = useState<string>('');
  const [descError, setDescError] = useState<string | undefined>(undefined);
  const [cat, setCat] = useState<string>('');
  const [catError, setCatError] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState<File | undefined>(undefined);
  const [iconError, setIconError] = useState<string | undefined>(undefined);
  const [screenshots, setScreenshots] = useState<File[] | undefined>(undefined);
  const [screenshotError, setScreenshotError] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string>();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [hasPassedLighthouse, setHasPassedLighthouse] = useState<boolean>(false);
  const [lightHouseData, setLightHouseData] = useState<string | undefined>(undefined);
  const [lightHouseLoading, setLightHouseLoading] = useState<boolean>(false);

  useIonViewDidEnter(() => {
    loadProfile();
    setIsLoading(false);
  })

  useIonViewWillLeave(() => {
    setIsLoading(true);
  })

  const loadProfile = async () => {
    const resp = await getProfile();
    if (resp) {
      setProfile(resp);
    }
  }

  const onPress = (option: string) => {
    setCatError(undefined);
    setCat(option);
  }

  const onIconChange = (files: File[]) => {
    setIconError(undefined);
    setIcon(files[0]);
  }

  const onScreenshotsChange = (files: File[]) => {
    setScreenshotError(undefined);
    setScreenshots(files);
  }

  const onAddPWA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit(true);
    let check = 0;
    if (!name) {
      setNameError('Name is required');
      check++;
    }

    if (!icon) {
      setIconError('Icon is required');
      check++;
    }

    if (!url) {
      setUrlError('Link is required');
      check++;
    }

    if (!(/^((https))/.test(url))) {
      setIsValidLink(false);
      check++;
    }

    if (!desc) {
      setDescError('Description is required');
      check++;
    }

    if (!cat) {
      setCatError('Category is required');
      check++;
    }

    if (!screenshots) {
      setScreenshotError('Atleast 1 screenshot is required');
      check++;
    }

    if (screenshots && screenshots.length > 6) {
      setScreenshotError('Max of 6 screenshots');
      check++;
    }

    if (check === 0) {
      const resp = await postApp(name, desc, url, cat, icon as File, screenshots as File[]);
      if (resp && resp.data && resp.data.message) {
        setToastMessage(resp.data.message);
        setShowToast(true);
      } else if (resp && resp.appId) {
        profile?.pwas.push(resp as PWA);
        setName('');
        setDesc('');
        setCat('');
        setUrl('');
        setIcon(undefined);
        setScreenshots(undefined);
        setShowModal(false);
        setToastMessage('Success');
        setShowToast(true);
      }
    }
    setIsSubmit(false);
  }

  const loadPwas = (filter: string) => {
    if (profile && profile.pwas) {
        const filteredPwas = profile.pwas.filter(pwa => pwa.status === filter);
        if (filteredPwas.length > 0) {
          return filteredPwas.map((pwa, idx) => (
            <div key={idx}>
              <PWACard url="/mypwa" history={history} pwa={pwa} />
              {filter === 'DENIED' && 
                <>
                  <span style={{paddingLeft: '15px'}}><strong>Reason</strong></span>
                  <p style={{padding: '15px'}}>{pwa.reason}</p>
                </>
              }
            </div>
          ));
        } else {
         return (
           <div style={{ width: '100%', margin: '20px', height: '50px', display: 'flex', alignItems: 'center', boxShadow: '0 0 3px #ccc'}}>
              <small style={{paddingLeft: '15px', color: 'rgb(115, 115, 115)'}}>{`No ${filter.toLowerCase()} apps yet`}</small>
           </div>
         )
        }
    }
  }

  const getLightHouseData = async (url: string) => {
    try {
      setLightHouseLoading(true);
      const response = await getLighthouseReport(url) as string;
      if (response) {
        setLightHouseData(response);
      }
      setLightHouseLoading(false);
    } catch (e) {
      console.error(`Issue getting lighthouse data: ${e}`);
    }
  }

  return (
    <IonPage>
        <IonModal 
          isOpen={showModal} 
          swipeToClose={true}
          onDidDismiss={() => {
            setShowModal(false);
            setIcon(undefined);
            setScreenshots(undefined);
          }}
        >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
            </IonButtons>
            <IonTitle>PWA</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{overflow: 'hidden'}}>
        <form>
          <IonList>
            <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
                    <IonInput
                        name="name"
                        type="text"
                        spellCheck={false}
                        value={name}
                        maxlength={25}
                        onIonChange={e => {
                            setName(e.detail.value!)
                            setNameError(undefined);
                        }}
                        required
                    />
                    {nameError &&
                    <IonText color="danger">
                      <p>{nameError}</p>
                    </IonText>
                    }
            </IonItem>
            <IonItem>
              <ImageUploader 
                fileContainerStyle={{
                  boxShadow: 'none'
                }}
                withPreview={true}
                withLabel={false}
                singleImage={true}
                withIcon={false}
                buttonText='Choose icon'
                onChange={onIconChange}
                imgExtension={['.jpg', '.png', '.jpeg']}
                maxFileSize={5242880}
              />
                {iconError &&
                  <IonText color="danger">
                    <p>{iconError}</p>
                  </IonText>
                }
            </IonItem>
            <IonItem>
            <IonLabel position="stacked">Link</IonLabel>
                    <IonInput
                        name="link"
                        type="text"
                        maxlength={80}
                        spellCheck={false}
                        value={url}
                        onIonChange={e => {
                          setUrlError(undefined);
                            const urlVal = e.detail.value!;
                            if (urlVal === '') {
                              setIsValidLink(true);
                            } else {
                              const isValid = /^((https))/.test(urlVal);
                              setIsValidLink(isValid);
                            }
                            setUrl(e.detail.value!)
                        }}
                        required
                    />
                    {
                      !isValidLink &&
                      <IonText color="danger">
                          <p className="ion-padding-start">Invald link (https required)</p>
                      </IonText>
                    }
                    {urlError &&
                      <IonText color="danger">
                        <p>{urlError}</p>
                      </IonText>
                    }
            </IonItem>
            <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
                    <IonTextarea
                        name="desc"
                        placeholder="Please describe your PWA"
                        rows={6}
                        spellCheck={true}
                        value={desc}
                        maxlength={1500}
                        onIonChange={e => {
                            setDescError(undefined);
                            setDesc(e.detail.value!)
                        }}
                        required
                    />
                    {descError &&
                      <IonText color="danger">
                        <p>{descError}</p>
                      </IonText>
                    }
            </IonItem>
            <IonItem>
              <CategoryOptions onPress={onPress} initValue={cat} />
                {catError &&
                  <IonText color="danger">
                    <p>{catError}</p>
                  </IonText>
                }
            </IonItem>
            <IonItem>
              <ImageUploader 
                fileContainerStyle={{
                  boxShadow: 'none'
                }}
                withPreview={true}
                withLabel={false}
                singleImage={false}
                withIcon={false}
                onChange={onScreenshotsChange}
                buttonText='Choose screenshots'
                imgExtension={['.jpg', '.png', '.jpeg']}
                maxFileSize={5242880}
              />
              {screenshotError &&
                <IonText color="danger">
                  <p>{screenshotError}</p>
                </IonText>
              }
            </IonItem>
          </IonList>
        </form>
        </IonContent>
        {
          url && !lightHouseData &&
            <IonButton expand='block' onClick={() => {if (url) getLightHouseData(url)}} disabled={lightHouseLoading}>
              lightHouseLoading ?
              <IonSpinner />
              :
              Run Lighthouse PWA Checkout
            </IonButton>
        }
        {
          lightHouseData &&
            <ReportViewer json={lightHouseData} />
        }
        {
          lightHouseData && (
            hasPassedLighthouse === true ? 
            <IonButton expand='block' onClick={onAddPWA} disabled={isSubmit}>Submit</IonButton> :
            <IonText color="danger">
            <p>Your app has not passed the proper tests on Lighthouse.</p>
            </IonText>
          )
        }
      </IonModal>
      <IonHeader>
        <IonToolbar>  
          <IonTitle>{profile?.username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class='content'>
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton class='fab'><IonIcon icon={menu} /></IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton type="button" onClick={() => setShowAlert(true)}>
              <IonIcon icon={logOut} />
            </IonFabButton>
            <IonFabButton type="button" onClick={() => setShowModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <IonGrid>
          <IonCol>
            { !isLoading && <h2 style={{marginLeft: '20px'}}>Approved</h2> }
            <IonRow>
              {loadPwas('APPROVED')}
            </IonRow>
          </IonCol>
          <IonCol>
          { !isLoading && <h2 style={{marginLeft: '20px'}}>Pending</h2> }
            <IonRow>
              {loadPwas('PENDING')}
            </IonRow>
          </IonCol>
          <IonCol>
            { !isLoading && <h2 style={{marginLeft: '20px'}}>Denied</h2>}
            <IonRow>
              {loadPwas('DENIED')}
            </IonRow>
          </IonCol>
        </IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header='Logout'
          message='Are you sure you want to log out?'
          buttons={[
            {
              text: 'Cancel',
              handler: () => setShowAlert(false)
            },
            {
              text: 'Logout',
              handler: () => {
                setToken(undefined);
                setIsLoggedIn(false);
                setProfile(undefined);
                setName('');
                setDesc('');
                setCat('');
                setUrl('');
                setIcon(undefined);
                setScreenshots(undefined);
                setShowModal(false);
                history.push('/login')
              }
            }
          ]}
        />
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        duration={3000}
        message={toastMessage}
        position='bottom'
      />
    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapDispatchToProps: {
    setToken,
    setIsLoggedIn
  },
  component: withRouter(Profile)
})