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
      <div className="ProfileCardLinks">
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
            className="ion-color-linkedin"
          />
        )}
        {profile?.twitter && (
          <LinkItem
            url={profile.twitter}
            logo={logoTwitter}
            className="ion-color-twitter"
          />
        )}
      </div>
      <div>
        <IonRow className="bottom-line-border">
          <IonCol>
            <p>Total Installs</p>
          </IonCol>
          <IonCol>
            <p>{data.totalInstalls}</p>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <p>Total App Page Views</p>
          </IonCol>
          <IonCol>
            <p>{data.totalPageViews}</p>
          </IonCol>
        </IonRow>
      </div>
    </div>
  )
}

export default memo(ProfileCard)
