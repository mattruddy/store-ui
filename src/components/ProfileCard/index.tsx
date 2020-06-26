import React, { useMemo, memo } from "react"
import { logoGithub, mailOutline, locationOutline } from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonButton, IonIcon } from "@ionic/react"
import { PWA } from "../../util/types"
import DataBox from "./DataBox"

export interface TotalAppData {
  totalInstalls: number
  totalPageViews: number
}

interface ContainerProps {
  isMyProfile: boolean
  avatar?: string
  gitHub?: string
  location?: string
  fullName?: string
  header?: string
  data?: TotalAppData
  email?: string | undefined
  username: string
  isLoading?: boolean
}

const ProfileCard: React.FC<ContainerProps> = ({
  isMyProfile,
  avatar,
  gitHub,
  location,
  header,
  fullName,
  email,
  username,
  isLoading,
  data,
}) => {
  return (
    <IonRow>
      <IonCol size="12">
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
                    className={`${fullName ? "" : "text-color"}`}
                    style={{ paddingLeft: "8px", margin: "0" }}
                  >
                    {fullName ? fullName : `@${username}`}
                  </h1>
                  {fullName && (
                    <h4
                      className="text-color"
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
        {location && (
          <div className="text-color">
            <IonIcon icon={locationOutline} />
            {location}
          </div>
        )}
        <div className="ProfileSubTitleBlock">
          {header && (
            <div
              style={{
                padding: "8px",
              }}
            >
              {header}
            </div>
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
      </IonCol>
      {data && <DataBox data={data} />}
    </IonRow>
  )
}

export default memo(ProfileCard)
