import React, { memo, Fragment } from "react"
import { IonButton, IonCard } from "@ionic/react"
import { Profile } from "../../util/types"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import { RouteMap } from "../../routes"
import { useHistory } from "react-router"
import "./styles.css"
import LinkItem from "./LinkItem"

interface ContainerProps {
  profile: Profile | undefined
  email: string | undefined
  isLoading: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  profile,
  email,
  isLoading,
}) => {
  const history = useHistory()

  return (
    <IonCard className="ProfileCard">
      {!isLoading && (
        <img
          alt="avatar"
          className="ProfileCardImg icon line-around"
          src={profile?.avatar ? profile.avatar : "assets/icon/logo.png"}
        />
      )}
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
      <IonButton
        onClick={() => history.push(RouteMap.SETTINGS)}
        color="dark"
        fill="outline"
      >
        Edit Profile
      </IonButton>
    </IonCard>
  )
}

export default memo(ProfileCard)
