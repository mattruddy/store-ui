import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonModal, IonList, IonInput, IonTextarea, IonText, IonImg, IonGrid, IonRow, IonIcon, IonButtons, IonFab, IonFabButton, IonFabList, IonAlert, useIonViewDidEnter } from '@ionic/react';
import { getProfile, postApp } from '../data/dataApi';
import { RouteComponentProps, withRouter, Redirect } from 'react-router';
import ImageUploader from 'react-images-upload';
import { connect } from '../data/connect';
import CategoryOptions from '../components/CategoryOptions';
import { UserProfile, PWA } from '../util/types';
import PWACard from '../components/PWACard';
import { add, menu, logOut } from 'ionicons/icons';
import { setToken, setIsLoggedIn } from '../data/user/user.actions';

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

  useIonViewDidEnter(() => {
    loadProfile();
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
        <IonContent scrollEvents={true}>
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
                imgExtension={['.jpg', '.png']}
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
                            setUrl(e.detail.value!)
                        }}
                        required
                    />
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
              <CategoryOptions onPress={onPress}/>
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
                imgExtension={['.jpg', '.png']}
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
          fontSize: '20px'
        }}>My PWAs</p>
        <IonGrid>
          <IonRow>
            { profile && profile.pwas && profile.pwas.map((pwa, idx) => <PWACard key={idx} name={pwa.name} appId={pwa.appId} category={pwa.category} icon={pwa.icon} />)}
          </IonRow>
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