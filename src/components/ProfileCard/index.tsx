import React, { memo } from "react"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonButton } from "@ionic/react"
import { PWA } from "../../util/types"
import { capitalize } from "../../util"
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
              <h1 style={{ paddingLeft: "8px", margin: "0" }}>
                {capitalize(username)}
              </h1>
            )}
            <div>
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
            {isMyProfile && (
              <div>
                <IonButton fill="outline" color="dark" routerLink="/settings">
                  Edit
                </IonButton>
              </div>
            )}
          </div>
        </div>
      </IonCol>
      {data && <DataBox data={data} />}
      {pwas && <AppImgs pwas={pwas} />}
    </IonRow>
  )
}

export default memo(ProfileCard)
