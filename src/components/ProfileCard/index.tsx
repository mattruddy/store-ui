import React, { memo } from "react"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
  locationOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonButton, IonIcon } from "@ionic/react"
import { PWA } from "../../util/types"
import AppImgs from "./AppImgs"
import DataBox from "./DataBox"

export interface TotalAppData {
  totalInstalls: number
  totalPageViews: number
}

interface ContainerProps {
  isMyProfile: boolean
  avatar?: string
  gitHub?: string
  twitter?: string
  linkedIn?: string
  location?: string
  fullName?: string
  header?: string
  data?: TotalAppData
  pwas?: PWA[]
  email?: string | undefined
  username?: string
  isLoading?: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  isMyProfile,
  avatar,
  twitter,
  gitHub,
  location,
  header,
  fullName,
  linkedIn,
  email,
  username,
  isLoading,
  data,
  pwas,
}) => {
  return (
    <IonRow className="bottom-line-border">
      <IonCol
        className="ProfileCardLeftCol"
        size="12"
        sizeLg={data ? "8" : "12"}
      >
        <div className="ProfileCardLeft">
          {!isLoading && (
            <img
              alt="avatar"
              className="ProfileCardImg icon line-around"
              src={avatar ? avatar : "assets/icon/logo.png"}
            />
          )}
          <div className="ProfileCardLeftInfo">
            {username && (
              <div>
                <h1 style={{ paddingLeft: "8px", margin: "0" }}>
                  {fullName ? fullName : `@${username}`}
                </h1>
                {fullName && (
                  <h4
                    className="text-color"
                    style={{ margin: "0", padding: "8px" }}
                  >{`@${username}`}</h4>
                )}
                {location && (
                  <div style={{ padding: "8px" }}>
                    <IonIcon icon={locationOutline} />
                    {location}
                  </div>
                )}
              </div>
            )}
            {isMyProfile && (
              <div>
                <IonButton fill="outline" color="dark" routerLink="/settings">
                  Edit
                </IonButton>
              </div>
            )}
          </div>
        </div>
        <div className="ProfileLinksCont">
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
        <div
          style={{
            padding: "32px",
            paddingTop: "16px",
          }}
        >
          {header}
        </div>
      </IonCol>
      {data && <DataBox data={data} />}
      {pwas && <AppImgs pwas={pwas} />}
    </IonRow>
  )
}

export default memo(ProfileCard)
