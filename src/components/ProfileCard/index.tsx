import React, { memo, Fragment } from "react"
import { Profile } from "../../util/types"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonLabel } from "@ionic/react"

export interface TotalAppData {
  totalInstalls: number
  totalPageViews: number
}

interface ContainerProps {
  profile: Profile | undefined
  data: TotalAppData
  email: string | undefined
  isLoading: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  profile,
  email,
  isLoading,
  data,
}) => {
  return (
    <div className="ProfileCard bottom-line-border">
      {!isLoading && (
        <img
          alt="avatar"
          className="ProfileCardImg icon line-around"
          src={profile?.avatar ? profile.avatar : "assets/icon/logo.png"}
        />
      )}
      <div className="ProfileCardLinks bottom-line-border">
        <LinkItem url={`mailto:${email}`} logo={mailOutline} />
        {profile?.gitHub && (
          <LinkItem
            url={profile.gitHub}
            logo={logoGithub}
            className="ion-color-github"
          />
        )}
        {profile?.linkedIn && (
          <LinkItem
            url={profile.linkedIn}
            logo={logoLinkedin}
            color="linkedin"
          />
        )}
        {profile?.twitter && (
          <LinkItem url={profile.twitter} logo={logoTwitter} color="twitter" />
        )}
      </div>
      <div style={{ width: "100%" }}>
        <IonRow className="DataRow bottom-line-border">
          <IonCol className="DataCol">Installs</IonCol>
          <IonCol className="DataCol text-color">{data.totalInstalls}</IonCol>
        </IonRow>
        <IonRow className="DataRow">
          <IonCol className="DataCol">Page Views</IonCol>
          <IonCol className="DataCol text-color">{data.totalPageViews}</IonCol>
        </IonRow>
      </div>
    </div>
  )
}

export default memo(ProfileCard)
