import React, { memo } from "react"
import {
  logoGithub,
  logoLinkedin,
  logoTwitter,
  mailOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonHeader, IonRouterLink } from "@ionic/react"
import { PWA } from "../../util/types"

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
  pwas?: PWA[]
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
          <div className="ProfileCardLeftRight">
            <h1 style={{ paddingLeft: "8px" }}>{username}</h1>
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
          <IonCol className="DataLeftCol" size="12" sizeLg="4">
            <IonRow>
              <IonCol className="DataRowLeft" size="6" sizeLg="12">
                <IonRow className="DataRow">
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
      {pwas && (
        <div className="ProfileAppsRow">
          {pwas.map((pwa, idx) => (
            <IonRouterLink
              style={{ padding: "8px" }}
              routerLink={`/pwa/${pwa.name.replace(/ /g, "-")}`}
            >
              <img
                style={{ padding: "8px" }}
                src={pwa.icon}
                height="50"
                width="50"
              />
            </IonRouterLink>
          ))}
        </div>
      )}
    </IonRow>
  )
}

export default memo(ProfileCard)
