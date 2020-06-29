import React, { useMemo, memo } from "react"
import {
  logoGithub,
  mailOutline,
  locationOutline,
  pinOutline,
} from "ionicons/icons"
import LinkItem from "./LinkItem"
import "./styles.css"
import { IonRow, IonCol, IonButton, IonIcon } from "@ionic/react"
import {
  PWA,
  OccupationStatus,
  OccupationStatusEnumProps,
} from "../../util/types"
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
  occupationStatus?: OccupationStatus
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
  occupationStatus,
  username,
  isLoading,
  data,
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
          <IonIcon icon={pinOutline} />{" "}
          {OccupationStatusEnumProps[occupationStatus]}
        </div>
      )}
      {location && (
        <div className="sub-color">
          <IonIcon style={{ paddingRight: "5px" }} icon={locationOutline} />
          {location}
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
      {data && <DataBox data={data} />}
    </>
  )
}

export default memo(ProfileCard)
