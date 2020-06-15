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
    </div>
  )
}

export default memo(ProfileCard)
