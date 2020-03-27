import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonModal, IonList, IonInput, IonTextarea, IonText, IonImg, IonGrid, IonRow, IonIcon, IonButtons, IonFab, IonFabButton, IonFabList, IonAlert, useIonViewDidEnter, IonCol, useIonViewWillLeave } from '@ionic/react';
import { getProfile, postApp } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import ImageUploader from 'react-images-upload';
import { connect } from '../data/connect';
import CategoryOptions from '../components/CategoryOptions';
import { UserProfile, PWA } from '../util/types';
import PWACard from '../components/PWACard';
import { add, menu, logOut } from 'ionicons/icons';
import { setToken, setIsLoggedIn } from '../data/user/user.actions';
import { fixFilesRotation } from '../util/utils';

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
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [cat, setCat] = useState<string>('');
  const [icon, setIcon] = useState<File | undefined>(undefined);
  const [screenshots, setScreenshots] = useState<File[] | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [nameTakenError, setNameTakenError] = useState<boolean>(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setCat(option);
  }

  const onIconChange = (files: File[]) => {
    setIcon(files[0]);
  }

  const onScreenshotsChange = (files: File[]) => {
    setScreenshots(files);
  }

  const onAddPWA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url && desc && cat && icon && screenshots) {
        //const blobsScreenshots = await fixFilesRotation(screenshots);
        //const blobsIcon = await fixFilesRotation([icon]);
        const resp = await postApp(name, desc, url, cat, icon, screenshots);
        if (resp && resp.data && resp.data.message === 'Name is taken') {
          setNameTakenError(true);
        } else if (resp && resp.appId) {
          profile?.pwas.push(resp as PWA);
          setName('');
          setDesc('');
          setCat('');
          setUrl('');
          setIcon(undefined);
          setScreenshots(undefined);
          setShowModal(false);
        }
    }
  }

  const loadPwas = (filter: string) => {
    if (profile && profile.pwas) {
        const filteredPwas = profile.pwas.filter(pwa => pwa.status === filter);
        if (filteredPwas.length > 0) {
          return filteredPwas.map((pwa, idx) => <PWACard key={idx} url="/mypwa" history={history} name={pwa.name} appId={pwa.appId} category={pwa.category} icon={pwa.icon} />);
        } else {
         return (
           <div style={{ width: '100%', margin: '20px', height: '50px', display: 'flex', alignItems: 'center', boxShadow: '0 0 3px #ccc'}}>
              <small style={{paddingLeft: '15px', color: 'rgb(115, 115, 115)'}}>{`No ${filter.toLowerCase()} apps yet`}</small>
           </div>
         )
        }
    }
  }

  return (
    <IonPage>
        <IonModal 
          isOpen={showModal} 
          swipeToClose={true}
          onDidDismiss={() => setShowModal(false)}
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
                        onIonChange={e => {
                            setName(e.detail.value!)
                            setNameTakenError(false)
                        }}
                        required
                    />
                    {nameTakenError &&
                    <IonText color="danger">
                      <p>Name is taken</p>
                    </IonText>}
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
            </IonItem>
            <IonItem>
            <IonLabel position="stacked">Link</IonLabel>
                    <IonInput
                        name="link"
                        type="text"
                        spellCheck={false}
                        value={url}
                        onIonChange={e => {
                            const urlVal = e.detail.value!;
                            if (urlVal === '') {
                              setIsValidLink(true);
                            } else {
                              const isValid = /^((https):\/\/)([A-z]+)\.([A-z]{2,})/.test(urlVal);
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
                            setDesc(e.detail.value!)
                        }}
                        required
                    />
            </IonItem>
            <IonItem>
              <CategoryOptions onPress={onPress} haveClear={false} />
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
            </IonItem>
          </IonList>
        </form>
        </IonContent>
        <IonButton expand='block' onClick={onAddPWA}>Submit</IonButton>
      </IonModal>
      <IonHeader>
        <IonToolbar>  
          <IonTitle>{profile?.username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton><IonIcon icon={menu} /></IonFabButton>
          <IonFabList side="bottom">
            <IonFabButton type="button" onClick={() => setShowAlert(true)}>
              <IonIcon icon={logOut} />
            </IonFabButton>
            <IonFabButton type="button" onClick={() => setShowModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFabList>
        </IonFab>
        <p style={{
          paddingLeft: '20px',
          fontSize: '50px',
          marginBottom: '0'
        }}>PWAs</p>
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