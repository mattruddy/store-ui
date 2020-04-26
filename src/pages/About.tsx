import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonItem, IonItemGroup, IonItemDivider, IonIcon, IonRouterLink } from '@ionic/react';
import { Icon } from '@iconify/react';
import appleSafari from '@iconify/icons-mdi/apple-safari';
import { add, addCircleOutline, ellipsisVertical, menu } from 'ionicons/icons';

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
                    <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>How Do I Install?</strong></IonLabel>
                </IonItemDivider>
                <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <ul>
                            <h2 style={{ color: 'black'}}>IOS</h2>
                            <li>Click the safari icon <Icon icon={appleSafari} color='grey' /> to open the browser</li>
                            <li>Go to actions <img alt="IOS action button" color='grey' height='15' width='15' src='assets/icon/action.png' /> </li>
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
                            <li>Click the plus <IonIcon icon={addCircleOutline} /> on the right side of the address bar (chrome only)</li>
                        </ul>
                    </div>
                </IonItem>    
            </IonItemGroup>
            <IonItemGroup>
                <IonItemDivider>
                    <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>Why PWA's?</strong></IonLabel>
                </IonItemDivider>
                <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                    <ul>
                        <li><strong>FREE</strong> to install</li>
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
                  <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>Want to Upload?</strong></IonLabel>
              </IonItemDivider>
              <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                  <ul>
                      <li>Go to <IonRouterLink style={{textDecoration: 'underline'}} color='rgb(153, 153, 153)' href='/login'>login</IonRouterLink></li>
                      <li>In the profile section click the <IonIcon icon={menu} /> button</li>
                      <li>A list will drop down, click <IonIcon icon={add} /> to present a submittion form</li>
                      <li>Ensure the PWA passes <a style={{color: 'rgb(153, 153, 153)'}} href="https://developers.google.com/web/tools/lighthouse" target='_blank'>Lighthouse Report</a> report beforehand, otherwise it will be denied</li>
                  </ul>
              </IonItem>
          </IonItemGroup>
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
                  <IonLabel style={{fontSize: '30px', color: 'black'}}><strong>Contact Us</strong></IonLabel>
              </IonItemDivider>
              <IonItem style={{color: 'rgb(153, 153, 153)'}}>
                  email: matt@progressiveapp.store
              </IonItem>
          </IonItemGroup>
          <p>&copy; PWA Store</p>
      </IonContent>
    </IonPage>
  );
};

export default About;