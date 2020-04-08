import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTextarea, IonButton, IonInput, IonLabel, IonToast } from '@ionic/react';
import { postEmail } from '../data/dataApi';

const Support: React.FC = () => {
  const [name, setName] = useState<string>();
  const [text, setText] = useState<string>();
  const [toastText, setToastText] = useState<string>();
  const [showToast, setShowToast] = useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <IonLabel>Name</IonLabel>
          <IonInput
            style={{boxShadow: '0 0 3px #ccc', width: '95%'}}
            value={name}
            onIonChange={(e) => {
              setName(e.detail.value!);
            }}
          />
          <IonLabel>Information</IonLabel>
          <IonTextarea
            style={{boxShadow: '0 0 3px #ccc', width: '95%'}}
            value={text}
            rows={10}
            onIonChange={(e) => {
              setText(e.detail.value!);
            }}
          />
          <IonButton style={{width: '95%'}} type="button" expand='full' onClick={async() => {
            await postEmail(name!, text!);
            setName('');
            setText('');
            setToastText('Sent. You will hear from us shortly');
            setShowToast(true);
          }}>Submit</IonButton>
        </div>
      </IonContent>
      <IonToast
        position='top'
        isOpen={showToast}
        duration={10000}
        message={toastText}
        onDidDismiss={() => setShowToast(false)}
      />
    </IonPage>
  );
};

export default Support;
