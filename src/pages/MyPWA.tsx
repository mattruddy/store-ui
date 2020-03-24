import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonGrid, IonRow, IonSearchbar, IonSelectOption, IonSelect, IonCard, IonCardHeader, IonCardContent, IonButton, IonImg, IonSlides, IonSlide, IonLabel, useIonViewDidEnter, IonFab, IonFabButton, IonIcon, IonFabList, IonTextarea, IonInput, IonAlert, useIonViewDidLeave } from '@ionic/react';
import ImageUploader from 'react-images-upload';
import { getPWA, putApp, deleteScreenshot, postAddScreenshots, deleteApp } from '../data/dataApi';
import { RouteComponentProps, withRouter } from 'react-router';
import { PWA as PWAType, Image } from '../util/types';
import { square, stop, remove, pencil, checkbox, removeCircle, removeSharp, earth } from 'ionicons/icons';

interface MatchParams {
  id: string | undefined;
}

interface OwnProps extends RouteComponentProps<MatchParams> { };

interface StateProps {

};

interface DispatchProps {
}

type PWAProps = OwnProps & StateProps & DispatchProps;

const MyPWA: React.FC<PWAProps> = ({
  history
}) => {

  const [pwa, setPwa] = useState<PWAType>();
  const [screenshots, setScreenshots] = useState<Image[]>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [desc, setDesc] = useState<string | undefined>(undefined);
  const [cat, setCat] = useState<string | undefined>(undefined);
  const [link, setLink] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<File[] | undefined>(undefined);
  const [showDeleteAlert, setShowDeleteAlter] = useState<boolean>(false);
  const slides = useRef<any>();

  useIonViewDidEnter(() => {
    loadPWA();
  }, [])

  useIonViewDidLeave(() => {
    setPwa(undefined);
    setScreenshots(undefined);
  }, [])

  const loadPWA = async () => {
    const resp = await getPWA(Number(history.location.pathname.split('/')[2])) as PWAType;
    setPwa(resp);
    setScreenshots(resp.screenshots);
    setName(resp.name);
    setCat(resp.category);  
    setDesc(resp.description);
    setLink(resp.link);
}

const editApp = async () => {
    if (name === pwa?.name && desc === pwa?.description && cat === pwa?.category) {
        setIsEdit(false);
        return;
    }
    const resp = await putApp(name!, desc!, cat!, Number(history.location.pathname.split('/')[2]));
    if (resp?.status === 200) {
        setPwa(resp.data);
        setScreenshots(resp.data.screenshots);
    }
    setIsEdit(false);
}

const removeImage = async (imageId: number) => {
    const resp = await deleteScreenshot(imageId);
    if (resp && screenshots) {
        setScreenshots(screenshots.filter(shot => shot.imageId !== imageId));
        slides.current.update();
    }
}

const addImages = async () => {
    const resp = await postAddScreenshots(images!, Number(history.location.pathname.split('/')[2]));
    if (resp.length > 0) {
        setScreenshots(prev => prev?.concat(resp));
        slides.current.update();
        setImages(undefined);
    }
}

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center'}}>
              { pwa && 
                <img style={{height: '70px', width: '70px', borderRadius: '5px', margin: '10px'}} src={pwa.icon} /> }
              { pwa && 
                <div style={{ paddingLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '70px'}}>
                  
                  {
                      isEdit
                      ?
                        <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
                      :
                        <p style={{ margin: '0', fontSize: '20px'}}>{pwa.name}</p>
                  }

                  <small>{pwa.category}</small>
                </div>}
            </div>
            {pwa && <IonButton style={{ marginRight: '10px'}} disabled={true}>Install</IonButton>}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonFab activated={isEdit} style={{paddingTop: '10px'}} horizontal="end" slot="fixed">
              <IonFabButton>
                  <IonIcon icon={square} />
              </IonFabButton>
                {
                    isEdit
                    ?
                    <IonFabList>
                        <IonFabButton type="button" onClick={() => setIsEdit(false)}>
                            <IonIcon icon={stop} />
                        </IonFabButton>
                        <IonFabButton type="button" onClick={editApp}>
                            <IonIcon icon={checkbox} />
                        </IonFabButton>                    
                    </IonFabList>
                    :
                    <IonFabList>
                        <IonFabButton type="button" onClick={() => setIsEdit(true)}>
                            <IonIcon icon={pencil} />
                        </IonFabButton>
                        <IonFabButton type="button" onClick={() => setShowDeleteAlter(true)}>
                            <IonIcon icon={removeSharp} />
                        </IonFabButton>
                    </IonFabList>
                }
          </IonFab>
        <h2 style={{paddingTop: '10px', paddingLeft: '10px'}}>About</h2>
        {
            isEdit 
            ?
            <IonTextarea value={desc}  onIonChange={(e => setDesc(e.detail.value!) )}/>
            :
            <div style={{height: '200px', padding: '15px'}}>
            {pwa && pwa.description}
            </div> 
        }
        <h2 style={{ paddingLeft: '10px' }}>Screenshots</h2>
        {
          screenshots && 
          <IonSlides ref={slides} key={screenshots.map((shot) => shot.imageId).join("_")} pager={true} options={{ initialSlide: 0, speed: 400}}>
          {screenshots.map((shot, idx) => (
                <IonSlide key={idx}>
                  {isEdit && 
                      <IonButton style={{
                        position: 'absolute',
                        bottom: '68%',
                        left: '60%',
                      }} color="danger" onClick={() => removeImage(shot.imageId)}><IonIcon icon={remove} />
                      </IonButton>
                    }
                    <img style={{height: '400px', width: '200px'}} src={shot.url} /> 
                </IonSlide>
            ))}
          </IonSlides>
        }
        {
            isEdit &&
            <form>
                <ImageUploader
                    fileContainerStyle={{
                        boxShadow: 'none'
                    }}
                    withPreview={true}
                    withLabel={false}
                    singleImage={false}
                    withIcon={false}
                    onChange={(files: File[]) => setImages(files)}
                    buttonText='Add screenshots'
                    imgExtension={['.jpg', '.png']}
                    maxFileSize={5242880}
                />
                { images && images.length > 0 && <IonButton expand='full' onClick={addImages}>Add {images.length > 1 ? 'Screenshots' : 'Screenshot'}</IonButton> }
            </form>

        }

      </IonContent>
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlter(false)}
        header={`Delete ${pwa?.name}`}
        message='Are you sure you want to delete this app?'
        buttons={[
          {
            text: 'Cancel',
            handler: () => setShowDeleteAlter(false)
          },
          {
            text: 'Delete',
            handler: async () => {
              const resp = await deleteApp(pwa?.appId!);
              history.push('/profile');
            }
          }
        ]}
      />
    </IonPage>
  );
};

export default withRouter(MyPWA);