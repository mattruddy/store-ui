import { memo } from "react"
import React from "react"
import "./styles.css"
import { IonIcon, IonRouterLink } from "@ionic/react"
import { logoTwitter, callOutline } from "ionicons/icons"

const Footer: React.FC = () => {
  return (
    <div className="Footer">
      <div className="FooterLeft">
        <p>
          <IonRouterLink routerLink="/about">
            <IonIcon style={{ marginRight: "5px" }} icon={callOutline} />
            Contact Us
          </IonRouterLink>
        </p>
        <p>
          <IonRouterLink href="https://discord.gg/eexEFrK" target="_blank">
            <img
              style={{ marginRight: "5px" }}
              height="14px"
              width="14px"
              src="/assets/icon/discord.png"
            />
            Discord
          </IonRouterLink>
        </p>
        <p>
          <IonRouterLink
            className="FooterRightIcon"
            href="https://twitter.com/PWAStore1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon
              style={{ marginRight: "5px" }}
              className="ion-color-twitter"
              icon={logoTwitter}
            />
            Twitter
          </IonRouterLink>
        </p>
        <p>&copy; 2020 PWA Store</p>
      </div>
    </div>
  )
}

export default memo(Footer)
