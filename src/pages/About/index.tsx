import React, { memo } from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItemDivider,
  IonIcon,
  IonRouterLink,
  IonGrid,
  IonRow,
  IonImg,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
} from "@ionic/react"
import { Icon } from "@iconify/react"
import appleSafari from "@iconify/icons-mdi/apple-safari"
import {
  add,
  addCircleOutline,
  ellipsisVertical,
  menu,
  logoTwitter,
} from "ionicons/icons"
import { RouteMap } from "../../routes"

const styles = {
  row: { color: "rgb(153, 153, 153)" },
  label: { fontSize: "30px", color: "black" },
  divider: { padding: 0, background: "inherit" },
}

const About: React.FC = () => (
  <IonPage>
    <IonHeader className="ion-no-border bottom-line-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle>Contact Information</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="content">
      <IonCard className="line-around">
        <IonCardHeader>
          <IonCardTitle>
            <IonRouterLink routerLink="/dev/mattruddy">
              Matthew Ruddy
            </IonRouterLink>
          </IonCardTitle>
          <a href="mailto:matt@progressiveapp.store">
            matt@progressiveapp.store
          </a>
        </IonCardHeader>
        <IonCardContent>
          <img
            style={{ borderRadius: "6px" }}
            height="180px"
            width="140px"
            src="/assets/selfies/matt.png"
          />
        </IonCardContent>
      </IonCard>
      <IonCard className="line-around">
        <IonCardHeader>
          <IonCardTitle>
            <IonRouterLink routerLink="/dev/energy_apple">
              Adam Geiger
            </IonRouterLink>
          </IonCardTitle>
          <a href="mailto:ag@progressiveapp.store">ag@progressiveapp.store</a>
        </IonCardHeader>
        <IonCardContent>
          <img
            style={{ borderRadius: "6px" }}
            height="140px"
            width="140px"
            src="/assets/selfies/adam.jpg"
          />
        </IonCardContent>
      </IonCard>
    </IonContent>
    <IonFooter className="ion-no-border">
      <p>&copy; 2020 PWA Store</p>
    </IonFooter>
  </IonPage>
)

export default memo(About)
