import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTextarea, IonButton, IonInput, IonLabel, IonToast, IonItem, IonText, IonItemGroup, IonItemDivider, IonIcon } from '@ionic/react';
import { Icon, InlineIcon } from '@iconify/react';
import appleSafari from '@iconify/icons-mdi/apple-safari';
import { add, addCircle, addCircleOutline, ellipse, ellipseSharp, ellipsisVertical } from 'ionicons/icons';

const About: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
            <IonItemGroup>
            <IonItemDivider>
                <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>About us</strong></IonLabel>
            </IonItemDivider>
            <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                <p> We believe Progressive Web App's were how apps should have been all along.
                    It gives the creators the freedom and flexability to build something that 
                    truly belongs to them without outside forces (Apple and Google) controlling the product
                    and taking significant cuts for their hard work. This caused app stores to turn into a 
                    series of ads and in app purchases. PWA's are a nice fresh start to make apps enjoyable again.
                    We really hope you enjoy using PWA's as much as we do!
                </p>
            </IonItem>    
          </IonItemGroup> 
          <IonItemGroup>
            <IonItemDivider>
                <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>Why PWA's?</strong></IonLabel>
            </IonItemDivider>
            <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                <ul>
                    <li>
                        HTTPS is <strong>required</strong> meaning you data is secure
                    </li>
                    <li>
                        Takes up <strong>less</strong> storage on your phone. No need to pay extra money for higher storage
                    </li>
                    <li>
                        <strong>No</strong> in app purchases or ads. Just a clean and simple app experience
                    </li>
                    <li>Has an <strong>offline</strong> mode. Apps can be used in areas where this is no internet connection</li>
                </ul>
            </IonItem>    
          </IonItemGroup>
          <IonItemGroup>
            <IonItemDivider>
                <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>How to Install?</strong></IonLabel>
            </IonItemDivider>
            <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <ul>
                        <h2 style={{ color: 'black'}}>IOS</h2>
                        <li>Click the safari icon <Icon icon={appleSafari} color='grey' /> to open the browser</li>
                        <li>Go to actions <img color='grey' height='15' width='15' src='assets/icon/action.png' /> </li>
                        <li>Press "Add to Home Screen"</li>
                    </ul>
                    <ul>
                        <h2 style={{ color: 'black'}}>Android</h2>
                        <li>By default it should prompt to install, if not</li>
                        <li>Go to actions <IonIcon icon={ellipsisVertical} /> (on the top right of the browser) </li>
                        <li>Press "Add to Home Screen"</li>
                    </ul>
                    <ul>
                        <h2 style={{ color: 'black'}}>Desktop</h2>
                        <li>Click the plus <IonIcon icon={addCircleOutline} /> on the right side of the address bar</li>
                    </ul>
                </div>
            </IonItem>    
          </IonItemGroup>             
      </IonContent>
    </IonPage>
  );
};

export default About;