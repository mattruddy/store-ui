import { memo } from "react"
import React from "react"
import "./styles.css"
import { IonIcon } from "@ionic/react"
import { logoTwitter, logoLinkedin, logoGithub } from "ionicons/icons"

const Footer: React.FC = () => {
  return (
    <div className="Footer">
      <div className="FooterLeft">&copy; 2020 PWA Store</div>
      <div className="FooterRight">
        <a
          className="FooterRightIcon"
          href="https://twitter.com/PWAStore1"
          target="_blank"
        >
          <IonIcon className="ion-color-twitter" icon={logoTwitter} />
        </a>
        <a
          className="FooterRightIcon"
          href="https://github.com/mattruddy/store-ui"
          target="_blank"
        >
          <IonIcon color="dark" icon={logoGithub} />
        </a>
      </div>
    </div>
  )
}

export default memo(Footer)
