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
        <IonTitle>About</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="content">
      <IonGrid fixed>
        <IonRow>
          <p>
            Follow us on{" "}
            <a
              href="https://twitter.com/PWAStore1"
              target="_blank"
              style={{ color: "#1DA1F2" }}
              rel="noopener noreferrer"
            >
              Twitter
              <IonIcon icon={logoTwitter} style={{ marginLeft: 1 }} />
            </a>{" "}
            for updates
          </p>
        </IonRow>
        <IonRow>
          <IonItemDivider style={styles.divider}>
            <IonLabel style={styles.label}>
              <strong>How Do I Install?</strong>
            </IonLabel>
          </IonItemDivider>
        </IonRow>
        <IonRow style={styles.row}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ul>
              <h2 style={{ color: "black" }}>IOS</h2>
              <li>
                Click the safari icon <Icon icon={appleSafari} color="grey" />{" "}
                to open the browser
              </li>
              <li>
                Go to actions{" "}
                <IonImg
                  alt="IOS action button"
                  color="grey"
                  style={{ height: 15, width: 15, display: "inline-block" }}
                  src="assets/icon/action.png"
                />{" "}
              </li>
              <li>Press "Add to Home Screen"</li>
            </ul>
            <ul>
              <h2 style={{ color: "black" }}>Android</h2>
              <li>By default it should prompt to install, if not</li>
              <li>
                Go to actions <IonIcon icon={ellipsisVertical} /> (on the top
                right of the browser){" "}
              </li>
              <li>Press "Add to Home Screen"</li>
            </ul>
            <ul>
              <h2 style={{ color: "black" }}>Desktop</h2>
              <li>
                Click the plus <IonIcon icon={addCircleOutline} /> on the right
                side of the address bar (chrome only)
              </li>
            </ul>
          </div>
        </IonRow>

        <IonRow>
          <IonItemDivider style={styles.divider}>
            <IonLabel style={styles.label}>
              <strong>Why PWAs?</strong>
            </IonLabel>
          </IonItemDivider>
        </IonRow>
        <IonRow style={styles.row}>
          <ul>
            <li>
              <strong>FREE</strong> to install
            </li>
            <li>
              HTTPS is <strong>required</strong> meaning your data is secure
            </li>
            <li>
              Takes up <strong>less</strong> memory on your phone. No need to
              pay extra money for higher storage
            </li>
            <li>
              <strong>No</strong> in app purchases or ads. Just a clean and
              simple app experience
            </li>
            <li>
              Has an <strong>offline</strong> mode. Apps can be used in areas
              where this is no internet connection
            </li>
          </ul>
        </IonRow>
        <IonRow>
          <IonItemDivider style={styles.divider}>
            <IonLabel style={styles.label}>
              <strong>Want to Upload?</strong>
            </IonLabel>
          </IonItemDivider>
        </IonRow>
        <IonRow style={styles.row}>
          <ul>
            <li>
              Go to{" "}
              <IonRouterLink
                style={{ textDecoration: "underline" }}
                color="rgb(153, 153, 153)"
                href={RouteMap.LOGIN}
              >
                login
              </IonRouterLink>
            </li>
            <li>
              In the profile section click the <IonIcon icon={menu} /> button
            </li>
            <li>
              A list will drop down, click <IonIcon icon={add} /> to present a
              submission form
            </li>
            <li>
              Ensure the PWA passes{" "}
              <a
                style={{ color: "rgb(153, 153, 153)" }}
                href="https://developers.google.com/web/tools/lighthouse"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lighthouse Report
              </a>{" "}
              report beforehand, otherwise it will be denied
            </li>
          </ul>
        </IonRow>

        <IonRow>
          <IonItemDivider style={styles.divider}>
            <IonLabel style={styles.label}>
              <strong>About us</strong>
            </IonLabel>
          </IonItemDivider>
        </IonRow>
        <IonRow style={styles.row}>
          <p>
            {" "}
            We believe Progressive Web Apps were how apps should have been all
            along. It gives the creators the freedom and flexibility to build
            something that truly belongs to them without outside forces (Apple
            and Google) controlling the product and taking significant cuts for
            their hard work. This caused app stores to turn into a series of ads
            and in app purchases. PWAs are a nice fresh start to make apps
            enjoyable again. We really hope you enjoy using PWAs as much as we
            do!
          </p>
        </IonRow>

        <IonRow>
          <IonItemDivider style={styles.divider}>
            <IonLabel style={styles.label}>
              <strong>Contact Us</strong>
            </IonLabel>
          </IonItemDivider>
        </IonRow>
        <IonRow style={styles.row}>email: matt@progressiveapp.store</IonRow>
        <IonRow>
          <p>&copy; {new Date().getFullYear()} PWA Store</p>
        </IonRow>
      </IonGrid>
    </IonContent>
  </IonPage>
)

export default memo(About)
