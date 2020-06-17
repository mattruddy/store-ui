import React, { memo } from "react"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonHeader } from "@ionic/react"

export interface TotalAppData {
  totalInstalls: number
  totalPageViews: number
}

interface ContainerProps {
  avatar?: string
  gitHub?: string
  twitter?: string
  linkedIn?: string
  data?: TotalAppData
  email?: string | undefined
  username?: string
  isLoading?: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  avatar,
  twitter,
  gitHub,
  linkedIn,
  email,
  username,
  isLoading,
  data,
}) => {
  return (
    <IonRow className="bottom-line-border">
      <IonCol className="bottom-line-border" size="12" sizeLg="8">
        <div className="ProfileCardLeft">
          {!isLoading && (
            <img
              alt="avatar"
              className="ProfileCardImg icon line-around"
              src={avatar ? avatar : "assets/icon/logo.png"}
            />
          )}
          <div className="ProfileCardLeftRight">
            <h1>{username}</h1>
            <div className="ProfileCardLinks">
              {email && <LinkItem url={`mailto:${email}`} logo={mailOutline} />}
              {gitHub && (
                <LinkItem
                  url={gitHub}
                  logo={logoGithub}
                  className="ion-color-github"
                />
              )}
              {linkedIn && (
                <LinkItem url={linkedIn} logo={logoLinkedin} color="linkedin" />
              )}
              {twitter && (
                <LinkItem url={twitter} logo={logoTwitter} color="twitter" />
              )}
            </div>
          </div>
        </div>
      </IonCol>

      {data && (
        <>
          <IonCol size="12" sizeLg="4">
            <IonRow>
              <IonCol size="6" sizeLg="12">
                <IonRow className="DataRow right-line-border">
                  <IonCol className="DataCol">Installs</IonCol>
                  <IonCol className="DataCol text-color">
                    {data.totalInstalls}
                  </IonCol>
                </IonRow>
              </IonCol>
              <IonCol size="6" sizeLg="12">
                <IonRow className="DataRow">
                  <IonCol className="DataCol">Page Views</IonCol>
                  <IonCol className="DataCol text-color">
                    {data.totalPageViews}
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonCol>
        </>
      )}
    </IonRow>
  )
}

export default memo(ProfileCard)
