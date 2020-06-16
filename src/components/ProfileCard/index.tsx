import React, { memo } from "react"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol } from "@ionic/react"

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
  isLoading?: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  avatar,
  twitter,
  gitHub,
  linkedIn,
  email,
  isLoading,
  data,
}) => {
  return (
    <div className="ProfileCard">
      {!isLoading && (
        <img
          alt="avatar"
          className="ProfileCardImg icon line-around"
          src={avatar ? avatar : "assets/icon/logo.png"}
        />
      )}
      <div className="ProfileCardLinks bottom-line-border">
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
      {data && (
        <div style={{ width: "100%" }}>
          <IonRow className="DataRow bottom-line-border">
            <IonCol className="DataCol">Installs</IonCol>
            <IonCol className="DataCol text-color">{data.totalInstalls}</IonCol>
          </IonRow>
          <IonRow className="DataRow bottom-line-border">
            <IonCol className="DataCol">Page Views</IonCol>
            <IonCol className="DataCol text-color">
              {data.totalPageViews}
            </IonCol>
          </IonRow>
        </div>
      )}
    </div>
  )
}

export default memo(ProfileCard)
