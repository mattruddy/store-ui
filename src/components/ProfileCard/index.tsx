import React, { memo } from "react"
import {
  logoGithub,
  mailOutline,
  locationOutline,
  pinOutline,
  businessOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonButton, IonIcon } from "@ionic/react"
import { OccupationStatus, OccupationStatusEnumProps } from "../../util/types"

interface ContainerProps {
  isMyProfile: boolean
  avatar?: string
  gitHub?: string
  country?: string
  region?: string
  fullName?: string
  header?: string
  email?: string | undefined
  occupationStatus?: OccupationStatus
  username: string
  isLoading?: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  isMyProfile,
  avatar,
  gitHub,
  country,
  region,
  header,
  fullName,
  email,
  occupationStatus,
  username,
  isLoading,
}) => {
  return (
    <>
      <div className="ProfileCardLeft">
        {!isLoading && (
          <img
            alt="avatar"
            className="ProfileCardImg icon line-around"
            src={avatar ? avatar : "assets/icon/apple-touch-icon.png"}
          />
        )}
        <div className="ProfileCardLeftInfo">
          {username && (
            <>
              <div>
                <h1
                  className="text-color"
                  style={{ paddingLeft: "8px", margin: "0" }}
                >
                  {fullName ? fullName : `@${username}`}
                </h1>
                {fullName && (
                  <h4
                    className="sub-color"
                    style={{
                      margin: "0",
                      paddingLeft: "8px",
                    }}
                  >{`@${username}`}</h4>
                )}
              </div>
              <div className="ProfileLinksCont">
                {email && (
                  <LinkItem url={`mailto:${email}`} logo={mailOutline} />
                )}
                {gitHub && (
                  <LinkItem
                    url={gitHub}
                    logo={logoGithub}
                    className="ion-color-github"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {occupationStatus && (
        <div style={{ paddingBottom: "5px" }} className="sub-color">
          <IonIcon
            icon={
              occupationStatus === OccupationStatus.COMPANY
                ? businessOutline
                : pinOutline
            }
          />{" "}
          {OccupationStatusEnumProps[occupationStatus]}
        </div>
      )}
      {country && region && (
        <div className="sub-color">
          <IonIcon style={{ paddingRight: "5px" }} icon={locationOutline} />
          {region}, {country}
        </div>
      )}
      <div className="ProfileSubTitleBlock">
        {header && (
          <p
            style={{
              padding: "8px",
              paddingLeft: "24px",
            }}
          >
            {header}
          </p>
        )}
        {isMyProfile && (
          <div>
            <IonButton
              fill="outline"
              color="dark"
              routerLink="/settings/profile"
            >
              Edit
            </IonButton>
          </div>
        )}
      </div>
    </>
  )
}

export default memo(ProfileCard)
